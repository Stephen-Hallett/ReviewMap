env=dev
project_id=reviewmap

echo 'Setting up workspace'
terraform -chdir=deploy workspace select -or-create "$env$project_id"

echo ''
echo "Validating..."
terraform -chdir=deploy validate
terraform -chdir=deploy fmt

echo ''
echo "Terraform plan using vars file: $env.vars"
terraform -chdir=deploy plan -input=false -var-file $env.tfvars -var project_id=$project_id -var client_id=$ARM_CLIENT_ID -var client_secret=$ARM_CLIENT_SECRET -var tenant_id=$ARM_TENANT_ID -var user_object_id=$USER_OBJECT_ID -out=deployment.tfplan