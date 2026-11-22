export interface GitHubUserInfo {
  login: string;
  name?: string;
  avatarUrl?: string;
}

export interface GitHubPushFile {
  path: string;
  content: string;
}

export interface GitHubPushParams {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  isPrivate: boolean;
  description: string;
  commitMessage: string;
  files: GitHubPushFile[];
  onProgress?: (msg: string) => void;
}

export interface GitHubPushResult {
  repoUrl: string;
  owner: string;
  repo: string;
  branch: string;
  filesPushed: number;
}

const GITHUB_API = 'https://api.github.com';

const toBase64Utf8 = (content: string): string => {
  const bytes = new TextEncoder().encode(content);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const slugifyRepoName = (title: string): string => {
  const normalized = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return normalized || 'andrea-web-project';
};

export async function fetchGitHubUser(token: string): Promise<GitHubUserInfo> {
  const cleanToken = token.trim();
  if (!cleanToken) {
    throw new Error('Veuillez saisir votre Personal Access Token GitHub.');
  }

  const res = await fetch(`${GITHUB_API}/user`, {
    headers: {
      Authorization: `Bearer ${cleanToken}`,
      Accept: 'application/vnd.github+json',
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Token GitHub invalide ou expiré (scope « repo » requis).');
    }
    throw new Error(`Erreur GitHub (${res.status}) lors de la vérification du compte.`);
  }

  const data = await res.json();
  return {
    login: data.login,
    name: data.name || data.login,
    avatarUrl: data.avatar_url,
  };
}

export async function pushFilesToGitHub(params: GitHubPushParams): Promise<GitHubPushResult> {
  const token = params.token.trim();
  const repo = slugifyRepoName(params.repo);
  const branch = params.branch.trim() || 'main';
  const commitMessage = params.commitMessage.trim() || 'Initial commit from Andrea Code Workspace';

  if (!token) {
    throw new Error('Le token GitHub (PAT) est requis pour pousser le dépôt.');
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  };

  let owner = params.owner.trim();
  if (!owner) {
    params.onProgress?.('Vérification du compte GitHub...');
    const user = await fetchGitHubUser(token);
    owner = user.login;
  }

  // 1. Check if repo exists, otherwise create it
  params.onProgress?.(`Vérification du dépôt ${owner}/${repo}...`);
  const checkRes = await fetch(`${GITHUB_API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, {
    headers,
  });

  if (checkRes.status === 404) {
    params.onProgress?.(`Création du dépôt ${repo}...`);
    const createRes = await fetch(`${GITHUB_API}/user/repos`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: repo,
        description: params.description || 'Projet web généré dans Andrea Code Workspace',
        private: params.isPrivate,
        auto_init: true,
      }),
    });

    if (!createRes.ok) {
      const errBody = await createRes.json().catch(() => ({}));
      throw new Error(errBody?.message || `Impossible de créer le dépôt (${createRes.status}).`);
    }

    // Brief delay so GitHub initializes default branch cleanly
    await new Promise((r) => setTimeout(r, 900));
  } else if (!checkRes.ok) {
    throw new Error(`Impossible d'accéder au dépôt (${checkRes.status}).`);
  }

  // 2. Push each file cleanly via Contents API
  for (let i = 0; i < params.files.length; i += 1) {
    const file = params.files[i];
    params.onProgress?.(`Envoi de ${file.path} (${i + 1}/${params.files.length})...`);

    const contentUrl = `${GITHUB_API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${file.path}`;
    let existingSha: string | undefined;

    const getRes = await fetch(`${contentUrl}?ref=${encodeURIComponent(branch)}`, { headers });
    if (getRes.ok) {
      const existingData = await getRes.json().catch(() => null);
      if (existingData?.sha) {
        existingSha = existingData.sha;
      }
    }

    const putRes = await fetch(contentUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: commitMessage,
        content: toBase64Utf8(file.content),
        branch,
        ...(existingSha ? { sha: existingSha } : {}),
      }),
    });

    if (!putRes.ok) {
      const errBody = await putRes.json().catch(() => ({}));
      throw new Error(
        `Échec sur ${file.path} (${putRes.status}) : ${errBody?.message || 'Vérifiez la branche ou les droits du token.'}`
      );
    }
  }

  return {
    repoUrl: `https://github.com/${owner}/${repo}`,
    owner,
    repo,
    branch,
    filesPushed: params.files.length,
  };
}
