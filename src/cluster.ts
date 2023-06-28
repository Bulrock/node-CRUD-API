import cluster from 'cluster';
import os from 'os';

const startCluster = async (): Promise<void> => {
  try {
    if (cluster.isPrimary) {
      const cpusCount = os.cpus().length;

      console.log('Master process started!');
      console.log(`Master process ID: ${process.pid}.`);
      console.log(`Starting ${cpusCount} processes...\n`);

      for (let i = 0; i < cpusCount; i++) {
        cluster.fork();
      }

      cluster.on('exit', (): void => {
        console.log(`One of workers died. Restarting...`);
        cluster.fork();
      });
    }

    if (cluster.isWorker) {
      console.log(`Starting worker with process ID: ${process.pid}...`);
      await import('../index.js');
    }
  } catch (err) {
    if (err) {
      console.log('Cluster start failed.');
    }
  }
};

startCluster();
