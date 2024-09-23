(function() {
  let voteKey = new URL(window.location.href).pathname.split('/')[1];
  if (!voteKey) return;

  fetch(`https://www.menti.com/core/vote-keys/${voteKey}/series_id`, { headers: { "Content-Type": "application/json" } })
    .then(r => r.json())
    .then(r => {
      let series_id = r.series_id;
      return fetch(`https://api.mentimeter.com/series/${series_id}`);
    })
    .then(r => r.json())
    .then(data => {
      console.log(`------------------------------ Mentify --------------------------------`)
      console.log(`Presentation: ${data.title}`);
      data.questions.forEach(q => {
        if (!q.type.includes('leaderboard') && q.type !== 'wordcloud' && !(q.type === 'quiz_open' && (!q.choices || q.choices.length === 0))) {
          console.log(`Question: ${q.question}`);
          q.choices?.filter(c => c.correct_answer).forEach(c => console.log(`Correct Answer: ${c.label}, Position: ${c.position}`));
          q.type === 'quiz_open' && q.choices.forEach(c => console.log(`Expected Correct Input: ${c.label}`));
        }
      });
      console.log(`------------------------------------------------------------------------`);
    })
    .catch(err => console.error("Error fetching Menti data", err));
})();
