// TabsComponent.js
import React from 'react';
import style from './Statistical.module.css';

const TabsComponent = ({ activeTab, setActiveTab }) => {
    return (
        <div className={style['tabs-container']}>
            <button
                className={activeTab === 'BarChartRooms' ? style.active : ''}
                onClick={() => setActiveTab('BarChartRooms')}
            >
                Biểu đồ phòng
            </button>
            <button
                className={activeTab === 'BarChartBeds' ? style.active : ''}
                onClick={() => setActiveTab('BarChartBeds')}
            >
                Biểu đồ giường
            </button>
            <button
                className={activeTab === 'BarChartBlocks' ? style.active : ''}
                onClick={() => setActiveTab('BarChartBlocks')}
            >
                Tình trạng phòng theo block
            </button>
            <button
                className={activeTab === 'BarChartDormStatus' ? style.active : ''}
                onClick={() => setActiveTab('BarChartDormStatus')}
            >
                Tình trạng ký túc xá
            </button>
        </div>
    );
};

export default TabsComponent;
