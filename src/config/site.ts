// Site and author configuration
// Extracted from Jekyll _config.yml for Astro implementation

export interface SiteConfig {
  title: string;
  description: string;
  url: string;
}

export interface AuthorConfig {
  name: string;
  bio: string;
  avatar: string;
  location: string;
  social: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  academic: {
    googleScholar?: string;
    orcid?: string;
  };
}

export const SITE: SiteConfig = {
  title: "Pedro Ferreira",
  description: "Academic researcher - HCI, nomadic work, and digital technologies",
  url: "https://pedropaf.com"
};

export const AUTHOR: AuthorConfig = {
  name: "Pedro Ferreira",
  bio: "Academic interested in leisure and the representation of users",
  avatar: "/images/profile.png",
  location: "Location",
  social: {
    twitter: "pedro2_0",
    github: "bacilo",
    linkedin: undefined // Empty in Jekyll config, conditionally render
  },
  academic: {
    googleScholar: "http://yourfullgooglescholarurl.com",
    orcid: "http://orcid.org/yourorcidurl"
  }
};
