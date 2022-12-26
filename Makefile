removeStack:
	aws cloudformation delete-stack --stack-name auction-service
samDeploy:
	sam build
	sam deploy --stack-name auction-service --s3-bucket aws-sam-cli-managed-default-samclisourcebucket-9zlzllbz5o49 --capabilities CAPABILITY_IAM
samLogs:
	sam logs -n putItemFunction --stack-name auction-service --tail