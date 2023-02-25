import React, { useEffect, useState } from 'react';
// eslint isn't resolving react-chartjs-2 for some reason
// eslint-disable-next-line import/no-unresolved
import { Pie } from 'react-chartjs-2';
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

  const loadChartJs = async () => {
    const defaultObj = (await import('chart.js'));
    const {
      Chart: chJs,
      ArcElement,
      Title,
      Tooltip,
      Legend,
    } = defaultObj;

    chJs.register(
      ArcElement,
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
    const data = await new Promise<void>((resolve) => {
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
        const killsAgainstThisGuild = killFeed.filter((kill) => kill.target.guild === guild.name && kill.killer.guild === selectedGuildName).length;
        const deathsFromThisGuild = killFeed.filter((kill) => kill.killer.guild === guild.name && kill.target.guild === selectedGuildName).length;

        const randomColor = colorPool[Math.floor(Math.random() * colorPool.length)];
        colorPool = colorPool.filter((color) => color !== randomColor);

        killLabels.push(`${guild.name}: ${killsAgainstThisGuild}`);
        killTallies.push(killsAgainstThisGuild);
        deathLabels.push(`${guild.name}: ${deathsFromThisGuild}`);
        deathTallies.push(deathsFromThisGuild);
        colors.push(randomColor);
      });

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
        animateScale: true,
        animateRotate: true
      }
    }
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
            <div className={`gs-chart-block gs-tile${dark ? ' dark' : ''}`}>
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

            <div className={`gs-chart-block gs-tile${dark ? ' dark' : ''}`}>
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
          </>
        )
      }

    </div>
  );
};

export default GuildStats;
