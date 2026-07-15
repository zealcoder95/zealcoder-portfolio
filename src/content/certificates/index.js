import { staticContentRepository } from "@/content/repositories/staticContentRepository";

export function getCertificates() {
  return staticContentRepository.getCertificates();
}
