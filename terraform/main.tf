terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Activation automatique des APIs GCP
resource "google_project_service" "gcp_services" {
  for_each = toset([
    "container.googleapis.com",
    "artifactregistry.googleapis.com",
    "iamcredentials.googleapis.com",
    "cloudresourcemanager.googleapis.com"
  ])
  project            = var.project_id
  service            = each.key
  disable_on_destroy = false
}

#  Artifact Registry
resource "google_artifact_registry_repository" "repo" {
  location      = var.region
  repository_id = "restaurant-api"
  format        = "DOCKER"
  description   = "Docker images for restaurant-api"
  depends_on    = [google_project_service.gcp_services]
}

#  Cluster GKE Autopilot (Kubernetes Managé)
resource "google_container_cluster" "primary" {
  name                = "restaurant-cluster"
  location            = var.region
  enable_autopilot    = true
  deletion_protection = false
  depends_on          = [google_project_service.gcp_services]
}

#  Service Account pour GitHub Actions
resource "google_service_account" "github_actions" {
  account_id   = "github-actions-sa"
  display_name = "Service Account for GitHub Actions CI/CD"
}

#  Permissions pour le Service Account
resource "google_project_iam_member" "gke_developer" {
  project = var.project_id
  role    = "roles/container.developer"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

resource "google_project_iam_member" "artifact_writer" {
  project = var.project_id
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

#  Workload Identity Federation pour GitHub Actions (Sans clé JSON)
resource "google_iam_workload_identity_pool" "github_pool" {
  workload_identity_pool_id = "github-actions-pool"
  display_name              = "GitHub Actions Pool"
}

resource "google_iam_workload_identity_pool_provider" "github_provider" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-actions-provider"
  display_name                       = "GitHub Actions Provider"

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.actor"      = "assertion.actor"
    "attribute.repository" = "assertion.repository"
  }
  
  attribute_condition = "attribute.repository == \"Agkader/sample-food-express\""

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

# Autorise GitHub à assumer le rôle du Service Account
resource "google_service_account_iam_member" "workload_identity_user" {
  service_account_id = google_service_account.github_actions.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github_pool.name}/attribute.repository/Agkader/sample-food-express"
}

# OUTPUTS (Valeurs à copier-coller dans les Secrets GitHub)

output "WIF_PROVIDER" {
  description = "Copier cette valeur dans le secret GitHub WIF_PROVIDER"
  value       = google_iam_workload_identity_pool_provider.github_provider.name
}

output "WIF_SERVICE_ACCOUNT" {
  description = "Copier cette valeur dans le secret GitHub WIF_SERVICE_ACCOUNT"
  value       = google_service_account.github_actions.email
}

output "GKE_CLUSTER_NAME" {
  value = google_container_cluster.primary.name
}