const express = require('express');
const Course = require('../models/course');

const newCourse = Course({
  course_title: 'Machine Learning in 24 Hours',
  description: 'Your awesome path to beginning Machine Learning',
  chapters: [
    {
      name: 'Setting up your tools',
      resource: 'http://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_1mb.mp4'
    },
    {
      name: 'Analyzing your first data',
      resource: 'http://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_1mb.mp4'
    },
    {
      name: 'Killing it in the Machine Learning Industry',
      resource: 'http://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_1mb.mp4'
    }
  ],
  author: 'Babatunde Adeyemi'
});

const watch = express();

newCourse.save((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Course added!');
  }
});
