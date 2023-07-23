import React from 'react';
// eslint isn't resolving react-chartjs-2 for some reason
// eslint-disable-next-line import/no-unresolved
import { Line } from 'react-chartjs-2';
import KillFeedItem from '../../components/KillFeedItem/KillFeedItem';
import { Guild, Kill } from '../../LogParser/models';
import './style.css';
import { formatTimestamp } from '../../util/util';

const Overview = ({ killFeed, guilds, isDarkMode }: {
  killFeed: Kill[],
  guilds: Guild[],
  isDarkMode?: boolean
}): React.ReactElement => {
  const [dataSets, setDataSets] = React.useState([]);
  const [labels, setLabels] = React.useState<string[] | number[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // We need to determine if this siege log had timestamps or not
  const hasTimestamps = !!killFeed[0].timestamp;

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

  const setupChartDataWithTimestamps = async () => {
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

      // Record to group kills by timestamp

      const timeStampArray = Array.from(new Set(killFeed.map((kill) => formatTimestamp(kill.timestamp.raw))));
      const xAxis: string[] = [...timeStampArray];

      // This represents a snapshot for a timestamp, capturing the kills that occurred, and the total points for each guild at that moment
      interface TimestampSnapshot {
        kills: Kill[],
        guildTotals: { guildName: string, score:number}[]
      }

      // Represents the kill feed grouped by timestamp
      const groupedKillFeed: TimestampSnapshot[] = [];

      /**
       * For each timestamp, we'll record the kills that occurred then, and the total points for each guild at that moment
       */
      timeStampArray.forEach((timestamp, timeStampIndex) => {
        const kills = killFeed.filter((kill) => formatTimestamp(kill.timestamp.raw) === timestamp);
        const guildTotalsForThisSnapshot: { guildName: string, score: number}[] = [];

        // For each guild, calculate the total points they have at this timestamp
        guilds.forEach((guild) => {
          const guildName = guild.name;
          const pointGainFromThisTimestamp = kills.filter((kill) => kill.killer.guild === guildName).reduce((acc, kill) => acc + (kill.pointGain?.total || 0), 0);

          const previousValueForGuild = groupedKillFeed[timeStampIndex - 1]?.guildTotals.find((g) => g.guildName === guildName).score || 0;

          guildTotalsForThisSnapshot.push({
            guildName,
            score: previousValueForGuild + (pointGainFromThisTimestamp)
          });
        });

        groupedKillFeed.push({
          kills,
          guildTotals: guildTotalsForThisSnapshot
        });
      });

      // Now, we need to generate the final dataset to pass to the chart
      const sets = guilds.map((guild) => {
        const randomColor = colorPool[Math.floor(Math.random() * colorPool.length)];
        colorPool = colorPool.filter((color) => color !== randomColor);

        // The chart needs a number array. This array will represent the total points for this guild at each timestamp
        const talliesForThisGuild: number[] = [];

        // Run through the kill feed and populate the array
        groupedKillFeed.forEach((snapshot) => {
          const guildTotalForThisSnapshot = snapshot.guildTotals.find((g) => g.guildName === guild.name);
          if (guildTotalForThisSnapshot) {
            talliesForThisGuild.push(guildTotalForThisSnapshot.score);
          } else {
            talliesForThisGuild.push(0);
          }
        });

        const dataSet = {
          label: guild.name,
          data: talliesForThisGuild || [],
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

  const setupChartDataNoTimestamps = async () => {
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

      const xAxis: number[] = [0];
      let tally = 0;

      // Every time a guild gains a kill, record the total number of points at that moment
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

        // console.log(guildTallies);
      });

      // console.log(`xAxis length is ${xAxis.length}`);
      const sets = guilds.map((guild) => {
        const randomColor = colorPool[Math.floor(Math.random() * colorPool.length)];
        colorPool = colorPool.filter((color) => color !== randomColor);

        const talliesForThisGuild = guildTallies.find((tally) => tally.guildName === guild.name);
        // console.log(`tallies length for guild ${guild.name} is ${talliesForThisGuild.tallies.length}`);

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
    if (hasTimestamps) {
      await setupChartDataWithTimestamps();
    } else {
      await setupChartDataNoTimestamps();
    }

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
      timeStamp={kill.timestamp?.raw}
      isDeath={false}
    />
  ));

  const data = {
    labels,
    datasets: dataSets
  };

  const getKillsForTimestamp = (timestamp: string) => {
    const kills = killFeed.filter((kill) => formatTimestamp(kill.timestamp?.raw) === timestamp);
    return kills;
  };

  const footer = (tooltipItems: any) => {
    if (hasTimestamps) {
      // The timestamp is already in the label, so we can just use that
      const timestamp = tooltipItems[0].label;

      const kills = getKillsForTimestamp(timestamp);

      // Join all the strings together, each on a new line
      const stringsForKills = kills.map((kill) => `[${kill.killer.guild}] ${kill.killer.name} killed [${kill.target.guild}] ${kill.target.name} (+${kill.pointGain.total})`);
      return stringsForKills.join('\n');
    }

    const kill = killFeed[tooltipItems[0].dataIndex];
    return `[${kill?.killer.guild}] ${kill?.killer.name} killed [${kill?.target.guild}] ${kill?.target.name} (+${kill?.pointGain.total})`;
  };

  const title = (tooltipItems: any) => {
    if (hasTimestamps) {
      return `Time: ${tooltipItems[0].label}`;
    }

    const killNumber = tooltipItems[0].dataIndex + 1;
    return `Kill #${killNumber}`;
  };

  const chartOptions = {
    plugins: {
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true
        },
        mode: 'xy',
      },
      tooltip: {
        callbacks: {
          footer,
          title
        },
        caretSize: 0
      },
      legend: {
        title: {
          color: isDarkMode ? '#fff' : 'var(--text-color)'
        },
        labels: {
          color: isDarkMode ? '#fff' : 'var(--text-color)'
        }
      }

    },
    interaction: {
      intersect: false,
      mode: 'index' as const, // cast to avoid TS warning
    },
    responsive: true,
    scales: {
      y: {
        title: {
          text: 'Guild Point Totals',
          display: true,
          family: 'Quicksand',
          color: isDarkMode ? '#fff' : 'var(--text-color)'
        },
      },
      x: {
        title: {
          color: isDarkMode ? '#fff' : 'var(--text-color)',
          text: hasTimestamps ? 'Time stamp' : 'Kills over time',
          display: true
        },
        // suggestedMin: 1,
        // suggestedMax: killFeed.length,
        ticks: { }

      }
    },

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

              <h3 className="overview-kf-title chart">Performance over time</h3>
              <div className={`overview-chart-block overview-tile${isDarkMode ? ' dark' : ''}`}>
                <span className="overview-kf-hint">Hint: click on a Guild color to toggle that guild in the chart</span>

                <Line options={chartOptions} data={data} />
              </div>

              <h3 className="overview-kf-title">Combat log</h3>
              <div className={`overview-kf overview-tile${isDarkMode ? ' dark' : ''}`}>
                {killElements}
              </div>

            </>
          )
      }
    </div>
  );
};

export default Overview;
