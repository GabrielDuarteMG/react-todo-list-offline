export class Utils {
static checkGithubToken = (token?: string | null) => {
    if (!token) {
        return false;
    }
    const classicRegex = /^[a-zA-Z0-9]{40}$/;
    const newRegex = /^github_pat_[a-zA-Z0-9_]{75}$/;
    const ghpRegex = /^ghp_[A-Za-z0-9]{36}$/;
    return classicRegex.test(token) || newRegex.test(token) || ghpRegex.test(token);
};
  static getGistIdByUrl = (url: string) => {
    const regex = /gist.github.com\/.*\/([a-zA-Z0-9]{32})/;
    const match = url.match(regex);
    if (match) {
      return match[1];
    }
    return null;
  };
}
