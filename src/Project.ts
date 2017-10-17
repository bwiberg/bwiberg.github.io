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
    color: string;
    images: string[];
    youtube: string;
    github: string;
}

export default Project;
