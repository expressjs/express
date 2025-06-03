pipeline{
    agent any
    tools{nodejs 'NodeJs 16.20.2'}
    stages{
        stage('Checkout') {
            stesp{
              dir('express-repo') {
                git url: 'https://github.com/expressjs/express.git', branch: 'master'  
            }
        }
        stage('Print NodeJS and NPM Versions') {
            steps{
                sh 'node -v'
            }
        }
        stage('Install Dependencies') {
            steps{
                dir('express-repo'){
                    sh 'npm install'
                }
            }
        }
        stage('Run Unit Tests') {
            steps{
                dir('express-repo') {
                    sh 'npm test'
                }
            }
        }
    }
}
