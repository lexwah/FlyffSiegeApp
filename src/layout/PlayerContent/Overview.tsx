import React from 'react';
// eslint isn't resolving react-chartjs-2 for some reason
// eslint-disable-next-line import/no-unresolved
import { Line } from 'react-chartjs-2';
import KillFeedItem from '../../components/KillFeedItem/KillFeedItem';
import { Guild, Kill } from '../../LogParser/models';
import './style.css';

const Overview = ({ killFeed, guilds }: {
  killFeed: Kill[],
  guilds: Guild[]
}): React.ReactElement => {
  const [dataSets, setDataSets] = React.useState([]);
  const [labels, setLabels] = React.useState<number[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const loadChartJs = async () => {
    const defaultObj = (await import('chart.js'));
    const {
      Chart: chJs,
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend,
    } = defaultObj;

    chJs.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend
    );
  };

  const setupChart = async () => {
    await new Promise<void>((resolve) => {
      let colorPool = [
        '#c9e8ff',
        '#fc99f0',
        '#f4be97',
        '#8befc4',
        '#a49ff4',
        '#f28f76',
        '#77f484',
        '#a3b1f7',
        '#4c1e9e',
        '#50c94c'
      ];

      const xAxis: number[] = [];
      let tally = 0;
      let guildTallies: { guildName: string, tallies: number[]}[] = guilds.map((guild) => ({
        guildName: guild.name,
        tallies: [0]
      }));

      killFeed.forEach((kill) => {
        tally += 1;
        xAxis.push(tally);

        const guildName = kill.killer.guild;
        guildTallies = guildTallies.map((gTally) => {
          const previousValueForThisGuild = gTally.tallies[gTally.tallies.length - 1];

          return {
            ...gTally,
            tallies: guildName === gTally.guildName ? [...gTally.tallies, previousValueForThisGuild + (kill.pointGain?.total || 0)] : [...gTally.tallies, previousValueForThisGuild]
          };
        });
      });

      const sets = guilds.map((guild) => {
        const randomColor = colorPool[Math.floor(Math.random() * colorPool.length)];
        colorPool = colorPool.filter((color) => color !== randomColor);

        const talliesForThisGuild = guildTallies.find((tally) => tally.guildName === guild.name);

        const dataSet = {
          label: guild.name,
          data: talliesForThisGuild?.tallies || [],
          fill: false,
          backgroundColor: randomColor,
          borderColor: randomColor,
          borderWidth: 2,
          pointRadius: 0
        };

        return dataSet;
      });

      setDataSets(sets);
      setLabels(xAxis);
      resolve();
    });
  };

  const init = async () => {
    await setupChart();
    await loadChartJs();
    setIsLoading(false);
  };

  React.useEffect(() => {
    init();
  }, []);

  const killElements = killFeed.map((kill, index) => (
    <KillFeedItem
      key={`kill-${index}`}
      killer={kill.killer}
      target={kill.target}
      pointGain={kill.pointGain}
      isDeath={false}
    />
  ));

  const data = {
    labels,
    datasets: dataSets
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        title: {
          text: 'Guild Point Totals',
          display: true,
          family: 'Quicksand'
        },
      },
      x: {
        title: {
          text: 'Total kills over time in the Siege',
          display: true
        },
        // suggestedMin: 1,
        // suggestedMax: killFeed.length,
        ticks: {
          // stepSize: killFeed.length / 10
        }

      }
    }
  };

  return (
    <div className="overview">
      {
        isLoading
          ? (
            <div className="overview-loading">
              <div className="dot-typing" />
            </div>
          )
          : (
            <>

              <h3 className="overview-kf-title">Performance over time</h3>
              <div className="overview-chart-block overview-tile">
                <Line options={chartOptions} data={data} />
              </div>

              <h3 className="overview-kf-title">Combat log</h3>
              <div className="overview-kf overview-tile">
                {killElements}
              </div>

            </>
          )
      }
    </div>
  );
};

export default Overview;
