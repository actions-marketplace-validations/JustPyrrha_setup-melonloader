import * as gh from "@actions/github";
import * as tc from "@actions/tool-cache";

export interface Version {
    /**
     * Explains itself.
     */
    type: "release" | "alpha",
    /**
     * Either the tag for the release, or the build number for alpha.
     */
    name: string,
    /**
     * If the version is in cache.
     */
    cached: boolean,
    /**
     * Cache name or download url.
     */
    source: string;
}

export async function findVersion(version: string, token: string): Promise<Version> {
    const octokit = gh.getOctokit(token);
    const output: Version = {
        type: version.startsWith("alpha") ? "alpha" : "release",
        name: "",
        cached: false,
        source: ""
    }

    if(version.startsWith("alpha")) {
        const buildRes = await octokit.request("GET /repos/{owner}/{repo}/actions/runs/", {
            owner: "LavaGang",
            repo: "MelonLoader"
        });
        let runId: number;

        if(version.length === "alpha".length) {
            runId = buildRes.data[0];
        } else {
            const run = buildRes.data.filter((x: any) => x.run_number === Number.parseInt(version.split("#")[1]))[0];
            runId = run.id;
        }
        const artifacts = await octokit.request("GET /repos/{owner}/{repo}/actions/{run_id}/artifacts", {
            owner: "LavaGang",
            repo: "MelonLoader",
            run_id: runId
        });

        // fuck you only x64
        output.source = artifacts.data.artifacts.filter((x: any) => x.name.endsWith("x64"))[0].archive_download_url;

    } else if (version === "latest") {
        const release = await octokit.rest.repos.getLatestRelease({
            owner: "LavaGang",
            repo: "MelonLoader"
        });
        output.source = release.data.assets.filter(x => x.name === "MelonLoader.x64.zip")[0].browser_download_url;
    } else {
        const releases = await octokit.rest.repos.listReleases({
            owner: "LavaGang",
            repo: "MelonLoader"
        });
        const release = releases.data.filter(x => x.tag_name === version || x.tag_name === `v${version}`)[0];
        if(!release) throw new Error(`Could not find a release tagged with ${version}.`);
        output.source = release.assets.filter(x => x.name === "MelonLoader.x64.zip")[0].browser_download_url;
    }

    const cached = tc.find(`melon-${output.type}`, output.name);
    output.cached = cached != null;

    return output;
}