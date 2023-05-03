import { defineStore } from 'pinia';

export interface TabItem {
    name: string;
}

export interface TabGroup {
    openTab: string;
    tabs: Map<string, TabItem>;
}

export interface TabGroupStoreState {
    tabGroups: Map<string, TabGroup>;
}

const useTabStore = defineStore('tabs', {
    state: (): TabGroupStoreState => ({
        tabGroups: new Map<string, TabGroup>(),
    }),
    getters: {
        getTab: (state) => {
            return (tabGroupName: string, name: string) => {
                if (state.tabGroups.has(tabGroupName)) {
                    const tabGroup: TabGroup =
                        state.tabGroups.get(tabGroupName)!;
                    let found;
                    if (tabGroup.tabs.has(name)) {
                        found = tabGroup.tabs.get(name);
                    }
                    return Object.assign({}, found);
                }
                return undefined;
            };
        },
        getOpenTab: (state) => {
            return (tabGroupName: string): string | undefined => {
                if (
                    state.tabGroups.has(tabGroupName) &&
                    state.tabGroups.get(tabGroupName)?.openTab !== undefined
                ) {
                    return state.tabGroups.get(tabGroupName)?.openTab!;
                }
                return undefined;
            };
        },
        getGroupTabs: (state) => {
            return (tabGroupName: string) => {
                if (state.tabGroups.has(tabGroupName)) {
                    return Array.from(
                        state.tabGroups.get(tabGroupName)!.tabs.keys()
                    );
                }
                return undefined;
            };
        },
    },
    actions: {
        add(groupName: string, tabName: string) {
            if (!this.tabGroups.has(groupName)) {
                initializeTabGroup(this, groupName, tabName);
            }

            const tabGroup: TabGroup = this.tabGroups.get(groupName)!;

            const exists = tabGroup.tabs.has(tabName);
            if (exists) {
                return;
            }

            const anonym = () => {};

            tabGroup.tabs.set(tabName, {
                name: tabName,
            });
        },
        switchTab(groupName: string, tabName: string) {
            if (this.tabGroups.has(groupName)) {
                const tabGroup: TabGroup = this.tabGroups.get(groupName)!;
                const oldTab = tabGroup.openTab;

                if (tabGroup.tabs.has(tabName)) {
                    tabGroup.openTab = tabName;
                }
            }
        },
    },
});

function initializeTabGroup(
    state: any,
    tabGroupName: string,
    tabName: string
): TabGroup {
    const newTabGroup: TabGroup = {
        openTab: tabName,
        tabs: new Map(),
    };

    state.tabGroups.set(tabGroupName, newTabGroup);
    return newTabGroup;
}

export default useTabStore;
