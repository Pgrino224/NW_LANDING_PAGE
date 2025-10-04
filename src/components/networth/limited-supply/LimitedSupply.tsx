import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Container from '../../responsive-container/Container';
import './LimitedSupply.css';

const LimitedSupply = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const data = [
    { name: 'Category A', value: 33.33, description: 'Description for Category A allocation' },
    { name: 'Category B', value: 33.33, description: 'Description for Category B allocation' },
    { name: 'Category C', value: 33.34, description: 'Description for Category C allocation' },
  ];

  const COLORS = ['#9333ea', '#a855f7', '#c084fc'];

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <section className="limited-supply-section">
      <Container>
        <div className="limited-supply-header">
          <div className="limited-supply-subtitle">TOKEN DISTRIBUTION</div>
          <h2 className="limited-supply-title">LIMITED SUPPLY</h2>
        </div>

        <div className="pie-chart-container" style={{ position: 'relative' }}>
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={activeIndex !== null ? 180 : 150}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                animationDuration={300}
              >
                {data.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    opacity={activeIndex === null ? 1 : activeIndex === index ? 1 : 0.3}
                    style={{ transition: 'opacity 0.3s ease' }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {activeIndex !== null && (
            <div className="segment-detail active">
              <div className="segment-detail-name">{data[activeIndex].name}</div>
              <div className="segment-detail-percentage">{data[activeIndex].value.toFixed(2)}%</div>
              <div className="segment-detail-description">{data[activeIndex].description}</div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default LimitedSupply;
