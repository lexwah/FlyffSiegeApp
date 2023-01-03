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

  const setupChartData = async () => {
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
    await setupChartData();
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

  const footer = (tooltipItems: any) => {
    const kill = killFeed[tooltipItems[0].dataIndex];
    return `[${kill?.killer.guild}] ${kill?.killer.name} killed [${kill?.target.guild}] ${kill?.target.name} (+${kill?.pointGain.total})`;
  };

  const title = (tooltipItems: any) => {
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
              <div className="overview-chart-block overview-tile">
                <span className="overview-kf-hint">Hint: click on a Guild color to toggle that guild in the chart</span>

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
