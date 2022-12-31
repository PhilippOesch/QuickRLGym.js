import { defineStore } from 'pinia';

export interface TabItem {
    name: string;
    selected: boolean;
}

const useTabStore = defineStore('tabs', {
    state: () => ({
        initialized: false,
        tabGroups: new Map<string, Array<TabItem>>(),
    }),
    getters: {
        getTab: (state) => {
            return (tabGroupName: string, name: string) => {
                if (state.tabGroups.has(tabGroupName)) {
                    const tabGroup: TabItem[] =
                        state.tabGroups.get(tabGroupName)!;
                    const found = tabGroup.find((value) => value.name == name);
                    return Object.assign({}, found);
                }
                return undefined;
            };
        },
        getOpenTab: (state) => {
            return (tabGroupName: string) => {
                if (state.tabGroups.has(tabGroupName)) {
                    const tabGroup: TabItem[] =
                        state.tabGroups.get(tabGroupName)!;
                    const found = tabGroup.find((value) => value.selected);
                    return Object.assign({}, found);
                }
                return undefined;
            };
        },
    },
    actions: {
        add(groupName: string, tabName: string) {
            if (!this.tabGroups.has(groupName)) {
                this.tabGroups.set(groupName, []);
            }

            const tabGroup: TabItem[] = this.tabGroups.get(groupName)!;

            const exists = tabGroup.find(
                (value: TabItem) => value.name == tabName
            );
            if (exists) return;

            tabGroup.push({
                name: tabName,
                selected: false,
            });
        },
        switchTab(groupName: string, tabName: string) {
            if (this.tabGroups.has(groupName)) {
                let tabGroup: TabItem[] = this.tabGroups.get(groupName)!;
                tabGroup = tabGroup.map((value: TabItem) => {
                    if (value.name == tabName) {
                        value.selected = true;
                        return value;
                    }
                    value.selected = false;
                    return value;
                });
                this.tabGroups.set(groupName, tabGroup);
            }
        },
        initialize(groupName: string, tabName: string) {
            if (!this.initialized) {
                this.switchTab(groupName, tabName);
                this.initialized = true;
            }
        },
    },
});

export default useTabStore;
