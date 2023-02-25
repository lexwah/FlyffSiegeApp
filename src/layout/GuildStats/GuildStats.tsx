import React, { useEffect, useState } from 'react';
// eslint isn't resolving react-chartjs-2 for some reason
// eslint-disable-next-line import/no-unresolved
import { Pie, Bar } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';
import SelectMenu from '../../components/SelectMenu/SelectMenu';
import { Guild, Kill, Player } from '../../LogParser/models';
import { useDarkMode } from '../../ui-preferences/DarkMode';
import './style.css';

interface KillShare {
  guild: string,
  tally: number,
  color: string
}

interface PlayerGuildStat {
  player: Player,
  kills: number,
  deaths: number
}

const GuildStats = ({
  players,
  guilds,
  killFeed
}: {
  players: Player[],
  guilds: Guild[],
  killFeed: Kill[]
}): React.ReactElement => {
  const options = guilds.map((guild) => ({ label: guild.name, value: guild }));
  const { guildName } = useParams<{guildName: string}>();
  const [guildSelection, setGuildSelection] = useState<any>(guildName ? options.find((g) => g.value.name === guildName) : null);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [isLoadingChartJs, setIsLoadingChartJs] = useState<boolean>(true);
  const [killsChartData, setKillsChartData] = useState<any>(null);
  const [deathsChartData, setDeathsChartData] = useState<any>(null);
  const dark = useDarkMode();
  const [playerKillData, setPlayerKillData] = useState<any>(null);
  const [playerDeathData, setPlayerDeathData] = useState<any>(null);

  const loadChartJs = async () => {
    const defaultObj = (await import('chart.js'));
    const {
      Chart: chJs,
      ArcElement,
      BarElement,
      CategoryScale,
      LinearScale,
      Title,
      Tooltip,
      Legend,
    } = defaultObj;

    chJs.register(
      ArcElement,
      BarElement,
      CategoryScale,
      LinearScale,
      Title,
      Tooltip,
      Legend
    );

    setIsLoadingChartJs(false);
  };

  const onFilterChange = (selection: any) => {
    setGuildSelection(selection);
  };
  const updateChart = async () => {
    setIsBusy(true);
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

      const selectedGuildName = guildSelection.value.name;
      const killLabels: string[] = [];
      const killTallies: number[] = [];
      const deathLabels: string[] = [];
      const deathTallies: number[] = [];
      const colors: string[] = [];

      guilds.filter((g) => g.name !== selectedGuildName).forEach((guild) => {
        const killFeedForThisGuild = killFeed.filter((kill) => kill.target.guild === guild.name && kill.killer.guild === selectedGuildName);
        const deathFeedFromThisGuild = killFeed.filter((kill) => kill.killer.guild === guild.name && kill.target.guild === selectedGuildName);
        const killsAgainstThisGuild = killFeedForThisGuild.length;
        const deathsFromThisGuild = deathFeedFromThisGuild.length;

        const randomColor = colorPool[Math.floor(Math.random() * colorPool.length)];
        colorPool = colorPool.filter((color) => color !== randomColor);

        killLabels.push(`${guild.name}: ${killsAgainstThisGuild}`);
        killTallies.push(killsAgainstThisGuild);
        deathLabels.push(`${guild.name}: ${deathsFromThisGuild}`);
        deathTallies.push(deathsFromThisGuild);
        colors.push(randomColor);
      });

      const playerStats: PlayerGuildStat[] = [];

      killFeed.forEach((kill) => {
        // Players who died to this guild
        if (kill.killer.guild === selectedGuildName) {
          const existingEntry = playerStats.find((stat) => stat.player.name === kill.target.name);
          if (existingEntry) {
            existingEntry.deaths += 1;
          } else {
            playerStats.push({
              player: kill.target,
              deaths: 1,
              kills: 0
            });
          }
        }

        // Players who killed this guild
        if (kill.target.guild === selectedGuildName) {
          const existingEntry = playerStats.find((stat) => stat.player.name === kill.killer.name);
          if (existingEntry) {
            existingEntry.kills += 1;
          } else {
            playerStats.push({
              player: kill.target,
              deaths: 0,
              kills: 1
            });
          }
        }
      });

      // Kills
      const kDataSet = {
        labels: killLabels,
        datasets: [
          {
            data: killTallies,
            backgroundColor: colors,
            borderColor: colors
          }
        ]
      };

      // Deaths
      const dDataSet = {
        labels: deathLabels,
        datasets: [
          {
            data: deathTallies,
            backgroundColor: colors,
            borderColor: colors
          }
        ]
      };

      const playerKillCountData = playerStats.filter((stat) => stat.kills > 0).sort((a, b) => {
        if (a.kills > b.kills) return -1;
        if (a.kills < b.kills) return 1;
        return 0;
      }).slice(0, 10);

      const playerDeathCountData = playerStats.filter((stat) => stat.deaths > 0).sort((a, b) => {
        if (a.deaths > b.deaths) return -1;
        if (a.deaths < b.deaths) return 1;
        return 0;
      }).slice(0, 10);

      const playerKillBarDataSet = {
        labels: playerKillCountData.map((stat) => stat.player.name),
        datasets: [
          {
            data: playerKillCountData.map((stat) => stat.kills),
            backgroundColor: '#df7e8b'
          }
        ]
      };

      const playerDeathBarData = {
        labels: playerDeathCountData.map((stat) => stat.player.name),
        datasets: [
          {
            data: playerDeathCountData.map((stat) => stat.deaths),
            backgroundColor: '#7cd28e'
          }
        ]
      };

      setPlayerKillData(playerKillBarDataSet);
      setPlayerDeathData(playerDeathBarData);
      setKillsChartData(kDataSet);
      setDeathsChartData(dDataSet);
      resolve();
    });

    setIsBusy(false);
  };

  useEffect(() => {
    loadChartJs();
  }, []);

  useEffect(() => {
    if (guildSelection) {
      updateChart();
    }
  }, [guildSelection]);

  const chartOptions = {
    layout: {
      padding: 1
    },
    plugins: {
      responsive: true,
      legend: {
        position: 'left',
        labels: {
          font: {
            family: 'Quicksand',
            size: 14
          }
        }
      },
      animation: {
        animateScale: true
      }
    }
  };

  const barTooltipTitle = (tooltipItems: any) => {
    console.log(tooltipItems[0]);
    const killNumber = tooltipItems[0].dataIndex + 1;
    return `${killNumber} kills`;
  };

  const barOptions = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false,
        position: 'top' as const,
        labels: {
          font: {
            family: 'Quicksand',
            size: 14
          }
        }
      },
      title: {
        display: false
      },
      animation: {
        animateScale: true
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          grid: {
            display: false
          }
        }
      }
      // tooltip: {
      //   callbacks: {
      //     title: barTooltipTitle
      //   },
      //   caretSize: 0
      // },
    },
  };

  return (
    <div className="gs-container">
      <div className="gs-top">
        <h3 className="gs-title">Guild Statistics</h3>
        <SelectMenu
          aria-label="Select a Guild"
          className="gs-filter"
          options={options}
          isMulti={false}
          placeholder="Select a Guild"
          onChange={onFilterChange}
          value={guildSelection}
        />
      </div>

      {
        !guildSelection ? (
          <div className="gs-empty">
            <h3>☝️ Select a Guild to view statistics about their performance.</h3>
          </div>
        ) : (
          <>
            <div className={`gs-tile${dark ? ' dark' : ''} inline-charts`}>
              <div className="gs-chart-block left">
                <h3 className="gs-chart-title">Kills on other Guilds</h3>
                {
                  (isBusy || isLoadingChartJs || !killsChartData) ? (
                    <LoadingIndicator />
                  ) : (
                    <div className="gs-chart-box">
                      <Pie data={killsChartData} options={chartOptions} />
                    </div>
                  )
                }
              </div>

              <div className="gs-chart-block">
                <h3 className="gs-chart-title">Deaths from other Guilds</h3>
                {
                  (isBusy || isLoadingChartJs || !deathsChartData) ? (
                    <LoadingIndicator />
                  ) : (
                    <div className="gs-chart-box">
                      <Pie data={deathsChartData} options={chartOptions} />
                    </div>
                  )
                }
              </div>
            </div>

            <div className={`gs-tile${dark ? ' dark' : ''} inline-charts`}>
              <div className="gs-chart-block bar left">
                <h3 className="gs-chart-title">
                  Took down
                  {' '}
                  {guildSelection.value.name}
                  {' '}
                  the most
                </h3>
                {
                  (isBusy || isLoadingChartJs || !playerKillData) ? (
                    <LoadingIndicator />
                  ) : (
                    <div className="gs-chart-box bar">
                      <Bar data={playerKillData} options={barOptions} />
                    </div>
                  )
                }
              </div>

              <div className="gs-chart-block bar right">
                <h3 className="gs-chart-title">
                  Died to
                  {' '}
                  {guildSelection.value.name}
                  {' '}
                  the most
                </h3>
                {
                  (isBusy || isLoadingChartJs || !playerDeathData) ? (
                    <LoadingIndicator />
                  ) : (
                    <div className="gs-chart-box bar">
                      <Bar data={playerDeathData} options={barOptions} />
                    </div>
                  )
                }
              </div>
            </div>
          </>
        )
      }

    </div>
  );
};

export default GuildStats;
