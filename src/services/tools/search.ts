import { SearchResult } from '../../types/tools';

interface SearchProvider {
  search(query: string): Promise<SearchResult[]>;
}

class DuckDuckGoSearch implements SearchProvider {
  async search(query: string): Promise<SearchResult[]> {
    try {
      const response = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
      );
      const data = await response.json();

      const results: SearchResult[] = [];

      if (data.AbstractText) {
        results.push({
          title: data.Heading || query,
          url: data.AbstractURL || '',
          snippet: data.AbstractText,
        });
      }

      if (data.RelatedTopics) {
        for (const topic of data.RelatedTopics.slice(0, 5)) {
          if (topic.Text && topic.FirstURL) {
            results.push({
              title: topic.Text.substring(0, 100),
              url: topic.FirstURL,
              snippet: topic.Text,
            });
          }
        }
      }

      return results;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }
}

class WikipediaSearch implements SearchProvider {
  async search(query: string): Promise<SearchResult[]> {
    try {
      const response = await fetch(
        `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
      );
      const data = await response.json();

      if (data.extract) {
        return [
          {
            title: data.title || query,
            url: data.content_urls?.desktop?.page || '',
            snippet: data.extract,
          },
        ];
      }
      return [];
    } catch (error) {
      return [];
    }
  }
}

export const SearchService = {
  providers: {
    duckduckgo: new DuckDuckGoSearch(),
    wikipedia: new WikipediaSearch(),
  },

  async search(query: string, provider: keyof typeof this.providers = 'duckduckgo'): Promise<SearchResult[]> {
    return this.providers[provider].search(query);
  },

  async searchMultiple(query: string): Promise<SearchResult[]> {
    const [ddgResults, wikiResults] = await Promise.all([
      this.search(query, 'duckduckgo'),
      this.search(query, 'wikipedia'),
    ]);

    return [...ddgResults, ...wikiResults].slice(0, 10);
  },
};
