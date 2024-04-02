import React, { useState } from "react";
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";

const DetailsTabs = () => {
    const [activeTab, setActiveTab] = useState("tab1");

    return (
        <Tabs value={activeTab} className=" mx-auto
        
        max-w-screen-lg mx-auto  p-4 mt-[4rem]">
            <TabsHeader
                className="rounded-none border-b border-blue-gray-50 font-semibold bg-transparent p-0"
                indicatorProps={{
                    className: "bg-transparent border-b-2 border-[#ba9934] shadow-none rounded-none",
                }}
            >
                <Tab key="tab1" value="tab1" onClick={() => setActiveTab("tab1")}>
                    Article Preview
                </Tab>
                <Tab key="tab2" value="tab2" onClick={() => setActiveTab("tab2")}>
                    SERP Details
                </Tab>
                <Tab key="tab3" value="tab3" onClick={() => setActiveTab("tab3")}>
                    Tab 3
                </Tab>
            </TabsHeader>
            <TabsBody>
                <TabPanel key="tab1" value="tab1">
                    <p>Content for Tab 1 goes here.</p>
                </TabPanel>
                <TabPanel key="tab2" value="tab2">
                    <p>Content for Tab 2 goes here.</p>
                </TabPanel>
                <TabPanel key="tab3" value="tab3">
                    <p>Content for Tab 3 goes here.</p>
                </TabPanel>
            </TabsBody>
        </Tabs>
    );
};

export default DetailsTabs;
