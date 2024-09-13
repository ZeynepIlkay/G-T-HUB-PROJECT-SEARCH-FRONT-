document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from refreshing the page
    var username = document.getElementById('username-input').value;
    fetchGitHubData(username);

    // Scroll up after form submission
    document.querySelector('main').scrollIntoView({ behavior: 'smooth' });
});

function fetchGitHubData(username) {
    fetchUserInfo(username);
    fetchGitHubProjects(username);
}

function fetchUserInfo(username) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.github.com/users/${username}`, true);
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
        <a href="${user.html_url}" target="_blank">
            <img src="${user.avatar_url}" alt="Profile Picture" width="100" height="100">
        </a>
        <p><strong>Name:</strong> <a href="${user.html_url}" target="_blank">${user.name}</a></p>
        <p><strong>Biography:</strong> ${user.bio}</p>
        <p><strong>Followers:</strong> ${user.followers}</p>
        <p><strong>Following:</strong> ${user.following}</p>
    `;
    userInfo.scrollIntoView({ behavior: 'smooth' });
}

function fetchGitHubProjects(username) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.github.com/users/${username}/repos?per_page=100`, true);
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 400) {
            var repos = JSON.parse(xhr.responseText);
            displayProjects(repos);
        } else {
            console.error('Error fetching repos', xhr.status, xhr.statusText);
        }
    };
    xhr.send();
}

function displayProjects(repos) {
    var projectList = document.getElementById('project-list');
    var pagination = document.getElementById('pagination');
    var reposPerPage = 10;
    var currentPage = 1;
    var totalPages = Math.ceil(repos.length / reposPerPage);

    function renderPage(page) {
        projectList.innerHTML = '';
        var start = (page - 1) * reposPerPage;
        var end = start + reposPerPage;
        var paginatedRepos = repos.slice(start, end);

        paginatedRepos.forEach(function(repo) {
            var repoElement = document.createElement('li');
            repoElement.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
            projectList.appendChild(repoElement);
        });

        pagination.innerHTML = '';

        var prevButton = document.createElement('button');
        prevButton.textContent = '<';
        prevButton.className = 'page-link';
        prevButton.disabled = page === 1;
        prevButton.addEventListener('click', function() {
            renderPage(page - 1);
        });
        pagination.appendChild(prevButton);

        var startPage = Math.max(1, page - 1);
        var endPage = Math.min(totalPages, page + 1);

        for (var i = startPage; i <= endPage; i++) {
            var pageLink = document.createElement('button');
            pageLink.textContent = i;
            pageLink.className = 'page-link';
            if (i === page) {
                pageLink.classList.add('active');
            }
            pageLink.addEventListener('click', function() {
                renderPage(Number(this.textContent));
            });
            pagination.appendChild(pageLink);
        }

        var nextButton = document.createElement('button');
        nextButton.textContent = '>';
        nextButton.className = 'page-link';
        nextButton.disabled = page === totalPages;
        nextButton.addEventListener('click', function() {
            renderPage(page + 1);
        });
        pagination.appendChild(nextButton);
    }

    renderPage(currentPage);
}