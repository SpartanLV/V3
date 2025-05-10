const mongoose = require('mongoose');
const Course = require('./models/Course');

const seedCourses = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/your-db-name', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Clear existing courses
    await Course.deleteMany();

    // In server.js temporary (remove after testing)
    const seedCourses = async () => {
        await Course.create({
        title: 'Introduction to Web Development',
        code: 'WEB101',
        description: 'Learn basic web technologies',
        materials: [
            {
            title: 'HTML Basics',
            filename: 'sample.pdf',
            type: 'pdf'
            }
        ]
        });
    };
    mongoose.connection.once('open', seedCourses);
    // Create test courses with materials
    const courses = [
      {
        title: 'Introduction to Programming',
        code: 'CS101',
        description: 'Basic programming concepts with Python',
        materials: [
          {
            title: 'Getting Started Guide',
            filename: 'intro.pdf',
            type: 'pdf'
          },
          {
            title: 'Variables Tutorial Video',
            filename: 'variables.mp4',
            type: 'video'
          }
        ]
      },
      {
        title: 'Web Development Basics',
        code: 'WD201',
        description: 'HTML, CSS, and JavaScript fundamentals',
        materials: [
          {
            title: 'HTML Cheat Sheet',
            filename: 'html-cheat-sheet.pdf',
            type: 'pdf'
          },
          {
            title: 'CSS Flexbox Guide',
            filename: 'flexbox-guide.pdf',
            type: 'pdf'
          }
        ]
      }
    ];

    await Course.insertMany(courses);
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedCourses();