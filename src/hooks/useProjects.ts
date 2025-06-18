import { useState, useEffect } from 'react';
import { apiService, Project } from '../services/api';

interface UseProjectsParams {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  author?: string;
}

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  total: number;
  pages: number;
  currentPage: number;
  refetch: () => void;
}

export const useProjects = (params: UseProjectsParams = {}): UseProjectsReturn => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(params.page || 1);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getProjects({
        page: params.page || 1,
        limit: params.limit || 12,
        search: params.search,
        tag: params.tag,
        author: params.author
      });
      
      setProjects(response.projects);
      setTotal(response.total);
      setPages(response.pages);
      setCurrentPage(response.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [params.page, params.limit, params.search, params.tag, params.author]);

  return {
    projects,
    loading,
    error,
    total,
    pages,
    currentPage,
    refetch: fetchProjects
  };
};