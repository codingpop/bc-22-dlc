/* eslint linebreak-style: ["error", "windows"]*/
/**
 *
 */
class Forum {

  addQuestion(data, textData) {
    const question = {
      question: textData.question,
      idOfPoster: textData.user,
      date: Date.now(),
      tag: textData.tag,
      file: [data.files],
      notify: textData.notify
    };
    return question;
  }

  saveAnswer(data, textData) {
    const question = {
      question: textData.question,
      idOfPoster: textData.user,
      date: Date.now(),
      tag: textData.tag,
      file: [data.files],
      notify: textData.notify
    };
    return question;
  }

}

export default Forum;
