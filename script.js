var API_CALL = "https://api.travis-ci.org/v3/owner/PrestaShop?include=organization.repositories,repository.default_branch,build.commit";

var config = JSON.parse(document.getElementById('config').innerHTML);

var StatusBoard = {
    init: function init() {
        var req = new XMLHttpRequest();
        req.open('GET', API_CALL, true);
        req.setRequestHeader('Content-Type', 'application/json');

        req.onreadystatechange = function () {
            if (req.status >= 200 && req.status < 400 && req.readyState == 4) {
                var response = JSON.parse(req.responseText);
                var repositories = new Array();

                for (var i = 0; i < response.repositories.length; i++) {
                    var repository = response.repositories[i];
                    if (config.repositories.indexOf(repository.name) !== -1) {
                        repositories.push(repository);
                    }
                }

                Vue.component('project', {
                    props: ['project'],
                    computed: {
                        since: function () {
                            var dateString = this.project.default_branch.last_build.finished_at;
                            var date = new Date(dateString);

                            var seconds = Math.floor((new Date() - date) / 1000);

                            var interval = Math.floor(seconds / 31536000);

                            if (interval > 1) {
                                return interval + " years";
                            }
                            interval = Math.floor(seconds / 2592000);
                            if (interval > 1) {
                                return interval + " months";
                            }
                            interval = Math.floor(seconds / 86400);
                            if (interval > 1) {
                                return interval + " days";
                            }
                            interval = Math.floor(seconds / 3600);
                            if (interval > 1) {
                                return interval + " hours";
                            }
                            interval = Math.floor(seconds / 60);
                            if (interval > 1) {
                                return interval + " minutes";
                            }
                            return Math.floor(seconds) + " seconds";
                        },
                        isBroken: function () {
                            return 'failed' === this.project.default_branch.last_build.state;
                        },
                        isOk: function () {
                            return 'passed' === this.project.default_branch.last_build.state;
                        },
                        isWaiting: function () {
                            return !this.isOk && !this.isBroken;
                        },
                        manageClasses: function () {
                            return {
                                'alert alert-danger': this.isBroken,
                                'alert alert-warning': this.isWaiting,
                                'alert alert-success': this.isOk
                            }
                        }
                    },
                    template: '#project-template',
                });

                var app = new Vue({
                    el: '#app',
                    data: {
                        projects: repositories
                    }
                });
            } else {}
        };
        req.send(null);
    }
};

StatusBoard.init();
