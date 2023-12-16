import React, { FC } from 'react';
import './TabList.css';

export type TabListProps = {
    activeTab: string;
    setActiveTab: (tab: string) => void;
};

export const TabList: FC<TabListProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="tab-list">
            <div
                className={`tab ${activeTab === 'system' ? 'active' : ''}`}
                onClick={() => setActiveTab('system')}
            >
                系统设置
            </div>
            <div
                className={`tab ${activeTab === 'model' ? 'active' : ''}`}
                onClick={() => setActiveTab('model')}
            >
                模型设置
            </div>
            <div
                className={`tab ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() => setActiveTab('about')}
            >
                关于
            </div>
        </div>
    );
};

export default TabList;
