import Vue from 'vue';
import Vuex from 'vuex';
import Project from '../Project';

Vue.use(Vuex);

module Mutations {
    export const SET_PROJECTS = "SET_PROJECTS";
}

interface Commit {
    (name: string, payload: any): any;
}

const url =
    "https://" +
    "docs.google.com/" +
    "spreadsheets/d/" +
    "1X3v9PooB2GlzWPhSyoYJE65Jva04mqAWoGXYOStk-pU/" +
    "pubhtml";

const store = new Vuex.Store({
    state: {
        projects: <Project[]> [],
    },
    getters: {
        projects: state => state.projects,
    },
    mutations: {
        [Mutations.SET_PROJECTS]: (state, projects: Project[]) => {
            state.projects = projects;
        },
    },
    actions: {
        fetchProjects: ({commit, getters}: { commit: Commit, getters: any }) => {
            return new Promise<null>((resolve, reject) => {
                let fetchProjectsFunc: () => void;

                const onDataRetrieved = (data: any) => {
                    try {
                        const projects: Project[] = (<any[]>data)
                            .filter(data => data.enabled.toLowerCase() === "true")
                            .map(data => {
                                data.rows = parseInt(data.rows);
                                data.cols = parseInt(data.cols);
                                data.tags = data.tags.split(", ") || [];
                                data.images = data.images.split(", ") || [];

                                return <Project> data;
                            });

                        commit(Mutations.SET_PROJECTS, projects);
                        resolve();

                        fetchProjectsFunc = () => {
                        };
                    } catch (e) {
                        reject(e);
                    }
                };

                fetchProjectsFunc = () => {
                    console.log("fetchProjectsFunc()");
                    Tabletop.init({
                            key: url,
                            simpleSheet: true,
                            callback: onDataRetrieved,
                        }
                    );

                    setTimeout(fetchProjectsFunc, 500);
                };

                fetchProjectsFunc();
            });
        }
    }
});

export default store;
