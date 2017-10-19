/**
 * Created by benjamin on 8/27/17.
 */

interface Project {
    title: string;
    thumbnail: string;
    rows: number;
    cols: number;
    description: string;
    tags: string[];
    images: string[];
    youtube: string;
    github: string;

    webpages: string[];
    webpageLabels: string[];
    webpageOcticons: string[];
}

export default Project;
