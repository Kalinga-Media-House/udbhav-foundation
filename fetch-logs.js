const https = require('https');

const options = {
  headers: {
    'User-Agent': 'Node.js',
    'Accept': 'application/vnd.github.v3+json'
  }
};

https.get('https://api.github.com/repos/Kalinga-Media-House/udbhav-foundation/actions/runs?per_page=1', options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const runs = JSON.parse(data);
    const runId = runs.workflow_runs[0].id;
    console.log(`Run ID: ${runId}`);
    
    https.get(`https://api.github.com/repos/Kalinga-Media-House/udbhav-foundation/actions/runs/${runId}/jobs`, options, (res2) => {
      let data2 = '';
      res2.on('data', chunk => data2 += chunk);
      res2.on('end', () => {
        const jobs = JSON.parse(data2);
        const failedJob = jobs.jobs.find(j => j.conclusion === 'failure');
        if (failedJob) {
          console.log(`Failed Job: ${failedJob.name} (${failedJob.id})`);
          
          https.get(`https://api.github.com/repos/Kalinga-Media-House/udbhav-foundation/actions/jobs/${failedJob.id}/logs`, options, (res3) => {
            if (res3.statusCode === 302) {
              const logUrl = res3.headers.location;
              https.get(logUrl, (res4) => {
                let logs = '';
                res4.on('data', chunk => logs += chunk);
                res4.on('end', () => {
                  const lines = logs.split('\n');
                  const errorLines = lines.filter(l => l.includes('error') || l.includes('ERR') || l.includes('fail'));
                  console.log('Error snippets:');
                  console.log(errorLines.slice(-30).join('\n'));
                });
              });
            } else {
              console.log('Could not fetch logs, status code:', res3.statusCode);
            }
          });
        } else {
          console.log('No failed jobs found.');
        }
      });
    });
  });
});
