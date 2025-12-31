pipeline {
  agent any

  environment {
    IMAGE = "node-app:${BUILD_NUMBER}"
    BLUE  = "node-app-blue"
    GREEN = "node-app-green"
  }

  stages {

    stage('Checkout Code') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker Image') {
      steps {
        sh '''
          echo "Building Docker image"
          docker build -t ${IMAGE} .
        '''
      }
    }

    stage('Ensure BLUE is Running (Live)') {
      steps {
        sh '''
          if docker ps | grep -q ${BLUE}; then
            echo "BLUE is already running"
          else
            echo "Starting BLUE application"
            docker run -d -p 8000:8000 \
              -e APP_COLOR=BLUE \
              --name ${BLUE} ${IMAGE}
          fi
        '''
      }
    }

    stage('Deploy GREEN (New Version)') {
      steps {
        sh '''
          echo "Deploying GREEN application"
          docker stop ${GREEN} || true
          docker rm ${GREEN} || true

          docker run -d -p 8001:8000 \
            -e APP_COLOR=GREEN \
            --name ${GREEN} ${IMAGE}
        '''
      }
    }

    stage('Health Check GREEN') {
      steps {
        sh '''
          echo "Running health check on GREEN"
          sleep 5
          curl -f http://localhost:8001
        '''
      }
    }

    stage('Promote GREEN → BLUE') {
      steps {
        sh '''
          echo "Promoting GREEN to BLUE (zero downtime)"

          docker stop ${BLUE} || true
          docker rm ${BLUE} || true

          docker stop ${GREEN}
          docker rm ${GREEN}

          docker run -d -p 8000:8000 \
            -e APP_COLOR=GREEN \
            --name ${BLUE} ${IMAGE}
        '''
      }
    }
  }

  post {
    failure {
      echo "Deployment failed – rollback, BLUE remains live"
      sh '''
        docker stop ${GREEN} || true
        docker rm ${GREEN} || true
      '''
    }

    success {
      echo "Deployment successful – BLUE is serving the new version"
    }
  }
}
