const User = require('../models/User');
const Course = require('../models/Course');
const Booking = require('../models/Booking');
const { Parser } = require('@json2csv/plainjs');

exports.generateReport = async (req, res) => {
  const { type } = req.params;
  const format = req.query.format || 'json'; // ✅ Corrected here

  try {
    let data;
    switch (type) {
      case 'users':
        data = await User.find().select('-password -__v').lean();
        break;
      case 'courses':
        data = await Course.find().populate('faculty', 'name email').lean();
        break;
      case 'bookings':
        data = await Booking.find()
          .populate('user', 'name email')
          .populate('facility')
          .sort({ startTime: -1 })
          .lean();
        break;
      default:
        return res.status(400).json({ error: 'Invalid report type' });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }

    if (format === 'csv') {
      try {
        const opts = {
          fields: Object.keys(data[0]).filter(key => !key.includes('_id') && !key.includes('password')),
          unwind: ['sessions']
        };
        
        const parser = new Parser(opts);
        const csv = parser.parse(data);

        res.header('Content-Type', 'text/csv');
        res.attachment(`${type}_report_${new Date().toISOString().split('T')[0]}.csv`);
        return res.send(csv);
      } catch (csvError) {
        console.error('CSV Conversion Error:', csvError);
        return res.status(500).json({ error: 'CSV conversion failed' });
      }
    }

    res.json({
      success: true,
      count: data.length,
      data
    });

  } catch (err) {
    console.error('Report Generation Error:', err);
    res.status(500).json({ 
      error: 'Failed to generate report',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
