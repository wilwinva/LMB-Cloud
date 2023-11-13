package test

import (
	"fmt"
	"os"
	"os/exec"
	"regexp"
	"strings"
	"testing"

	"github.com/gookit/color"
	http_helper "github.com/gruntwork-io/terratest/modules/http-helper"
	"github.com/gruntwork-io/terratest/modules/terraform"
)

// variables to be changed per project
var name = "nwm-tdms"
var environment = "development"
var terraformDir = "../root/"

// derived
var key = name + "-" + environment + ".tfstate"
var TDMSADAUTH = os.Getenv("NWMTDMSADAUTH")

func TestST_PlanHasChanged(t *testing.T) {
	// Specify the test options
	tfOptions := &terraform.Options{
		TerraformDir: terraformDir,
		BackendConfig: map[string]interface{}{
			"resource_group_name":  "tstate",
			"storage_account_name": "tstate6269",
			"container_name":       "tstate",
			"key":                  key,
		},
		VarFiles: []string{"./env/" + environment + ".tfvars"},
		Vars: map[string]interface{}{
			"keyvault-ad-auth": TDMSADAUTH,
		},
	}

	// Terraform init and plan only
	tfPlanOutput := "terraform.tfplan"
	terraform.Init(t, tfOptions)
	terraform.RunTerraformCommand(t, tfOptions, terraform.FormatArgs(tfOptions, "plan", "-out="+tfPlanOutput)...)
	tfOptionsEmpty := &terraform.Options{}

	// parse the plan
	thePlan, _ := terraform.RunTerraformCommandAndGetStdoutE(t, tfOptions, terraform.FormatArgs(tfOptionsEmpty, "show", tfPlanOutput)...)
	thePlanSplit := strings.Split(thePlan, "\n")
	planSummary := thePlanSplit[len(thePlanSplit)-1]
	planSummarySplit := strings.Split(planSummary, ",")
	planAdd := strings.Split(planSummarySplit[0], " ")[1]
	planChange := strings.Split(planSummarySplit[1], " ")[1]
	planDestroy := strings.Split(planSummarySplit[2], " ")[1]

	// Print the plan summary
	color.Blue.Printf("######################################################################################\n")
	color.Green.Printf(planAdd + " to add, ")
	color.Yellow.Printf(planChange + " to change, ")
	color.Red.Printf(planDestroy + " to destroy. ")
	color.Cyan.Printf("State pulled from: " + key + "\n")
	color.Blue.Printf("######################################################################################\n")

	// find all the created items and print them to console
	if planAdd != "0" {
		re := regexp.MustCompile("(?m)[\r\n]+^.*(created|replaced).*$")
		res := re.FindAllString(thePlan, -1)
		color.Green.Println("\nThe following " + planAdd + " item(s) will be CREATED")
		println(strings.Trim(fmt.Sprint(res), "[]\n"))
		color.Green.Printf("######################################################################################\n")
	}

	// find all the updated items and print them to console
	if planChange != "0" {
		re := regexp.MustCompile("(?m)[\r\n]+^.*updated.*$")
		res := re.FindAllString(thePlan, -1)
		color.Yellow.Println("\nThe following " + planChange + " item(s) will be UPDATED")
		println(strings.Trim(fmt.Sprint(res), "[]\n"))
		color.Yellow.Printf("######################################################################################\n")
	}

	// find all the destroyed items and print them to console
	if planDestroy != "0" {
		re := regexp.MustCompile("(?m)[\r\n]+^.*(destroyed|replaced).*$")
		res := re.FindAllString(thePlan, -1)
		color.Red.Println("\nThe following " + planDestroy + " item(s) will be DESTROYED")
		println(strings.Trim(fmt.Sprint(res), "[]\n"))
		color.Red.Printf("######################################################################################\n")
	}

	if planAdd == "0" && planChange == "0" && planDestroy == "0" {
		t.Fatal("Plan contains no changes")
	}
}

// https://github.com/bridgecrewio/checkov
func TestUT_RunCheckov(t *testing.T) {
	cmd := exec.Command("checkov", "-d", terraformDir)
	out, err := cmd.CombinedOutput()
	if err != nil {
		t.Error(err)
	}
	fmt.Printf("combined out:\n%s\n", string(out))
}
func TestUT_PlanIsNotDestructive(t *testing.T) {
	// Specify the test options
	tfOptions := &terraform.Options{
		TerraformDir: terraformDir,
		BackendConfig: map[string]interface{}{
			"resource_group_name":  "tstate",
			"storage_account_name": "tstate6269",
			"container_name":       "tstate",
			"key":                  key,
		},
		VarFiles: []string{"./env/" + environment + ".tfvars"},
		Vars: map[string]interface{}{
			"keyvault-ad-auth": TDMSADAUTH,
		},
	}

	// Terraform init and plan only
	tfPlanOutput := "terraform.tfplan"
	terraform.Init(t, tfOptions)
	terraform.RunTerraformCommand(t, tfOptions, terraform.FormatArgs(tfOptions, "plan", "-out="+tfPlanOutput)...)

	tfOptionsEmpty := &terraform.Options{}

	// parse the plan
	thePlan, _ := terraform.RunTerraformCommandAndGetStdoutE(t, tfOptions, terraform.FormatArgs(tfOptionsEmpty, "show", tfPlanOutput)...)
	thePlanSplit := strings.Split(thePlan, "\n")
	planSummary := thePlanSplit[len(thePlanSplit)-1]
	planSummarySplit := strings.Split(planSummary, ",")
	planDestroy := strings.Split(planSummarySplit[2], " ")[1]

	// find all the destroyed items and print them to console
	if planDestroy != "0" {
		re := regexp.MustCompile("(?m)[\r\n]+^.*(destroyed|replaced).*$")
		res := re.FindAllString(thePlan, -1)
		color.Red.Println("\nThe following " + planDestroy + " item(s) will be DESTROYED")
		println(strings.Trim(fmt.Sprint(res), "[]\n"))
		color.Red.Printf("######################################################################################\n")
	}

	if planDestroy != "0" {
		t.Fatal("Plan is destructive!")
	}
}
func TestIT_IISPage(t *testing.T) {
	t.Parallel()

	terraformOptions := &terraform.Options{
		TerraformDir: terraformDir,
		BackendConfig: map[string]interface{}{
			"resource_group_name":  "tstate",
			"storage_account_name": "tstate6269",
			"container_name":       "tstate",
			"key":                  key,
		},
		VarFiles: []string{"./env/" + environment + ".tfvars"},
		Vars: map[string]interface{}{
			"keyvault-ad-auth": TDMSADAUTH,
		},
	}

	// At the end of the test, run `terraform destroy` to clean up any resources that were created.
	// defer terraform.Destroy(t, terraformOptions)

	// Run `terraform init`
	terraform.Init(t, terraformOptions)

	// Run terraform apply.  If it fails the first time aroumd, try again.
	//   This is currently necessary due to the way that the front door grabs the public ips from the VMs created previously.
	//   There is a dependency race condition where the public IPS haven't been logged to state when the front door by the
	//   time the front door looks for them. This is still the case even when declaring an explicit dependency (with depends_on).
	//     also tried creating the front door as a sperate module and using remote_state to get the ips.  Problem still exists.
	//   This could be remedied by putting the public ip info into variables (but this would require us to know them beforehand)
	if _, err := terraform.ApplyE(t, terraformOptions); err != nil {
		terraform.Apply(t, terraformOptions)
	}

	// Run `terraform output` to get the IP of the instance
	output := terraform.OutputList(t, terraformOptions, "front-door-host-name")
	url := "http://" + output[0]

	fmt.Println("Output:" + output[0])
	fmt.Println("url:" + url)

	// Validate the provisioned webpage
	http_helper.HttpGet(t, url, nil)
}
