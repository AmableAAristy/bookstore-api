pipeline {
    agent any

    environment {
        NODE_VERSION = '20.10.0'
        MONGODB_URI = 'mongodb://localhost:27017/bookstore'
    }

    stages {
        stage('Checkout') {
            steps {
                // Checks out the source code for a Jenkins Pipeline project
                checkout scm
            }
        }

        stage('Setup MongoDB') {
            steps {
                // Start MongoDB before running the tests
                sh 'docker run -d -p 27017:27017 mongo'
            }
        }

        stage('Setup Node.js') {
            steps {
                // Use Node Version Manager (nvm) to set Node.js version
                sh '''
                source /home/jenkins/.nvm/nvm.sh  // Adjust the path as needed for your Jenkins setup
                nvm install $NODE_VERSION
                nvm use $NODE_VERSION
                '''
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run tests') {
            steps {
                sh 'npm test'
            }
        }
    }

    post {
        always {
            // Cleanup MongoDB container
            sh 'docker stop $(docker ps -q --filter ancestor=mongo)'
            sh 'docker rm $(docker ps -a -q --filter ancestor=mongo)'
        }
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
