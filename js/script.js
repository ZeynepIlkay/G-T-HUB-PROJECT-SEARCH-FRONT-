function fetchGitHubData(username) {
    fetchUserInfo(username);
    fetchGitHubProjects(username);
}

function fetchUserInfo(username) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.github.com/users/${username}`, true);
   // xhr.setRequestHeader('Authorization', 'Bearer x');  // Token gerekli
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 400) {
            var user = JSON.parse(xhr.responseText);
            displayUserInfo(user);
        } else {
            console.error('Error fetching user info', xhr.status, xhr.statusText);
        }
    };
    xhr.send();
}

function displayUserInfo(user) {
    var userInfo = document.getElementById('user-info');
    userInfo.innerHTML = `
        <p><strong>Username:</strong> ${user.name}</p>
        <p><strong>Bio:</strong> ${user.bio}</p>
        <p><strong>Followers:</strong> ${user.followers}</p>
        <p><strong>Following:</strong> ${user.following}</p>
    `;
}

function fetchGitHubProjects(username) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.github.com/users/${username}/repos?per_page=100`, true);
   // xhr.setRequestHeader('Authorization', 'Bearer x');  // Token gerekli
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 400) {
            var repos = JSON.parse(xhr.responseText);
            displayProjects(repos, username);
        } else {
            console.error('Error fetching repos', xhr.status, xhr.statusText);
        }
    };
    xhr.send();
}

function displayProjects(repos, username) {
    var projectList = document.getElementById('project-list');
    projectList.innerHTML = '';

    repos.forEach(function(repo) {
        var repoElement = document.createElement('li');
        repoElement.textContent = `${repo.name} - Private: ${repo.private}`;
        projectList.appendChild(repoElement);

    });
}

