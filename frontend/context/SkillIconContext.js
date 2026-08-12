'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/apiClient';

const SkillIconContext = createContext({ iconMap: {}, skills: [], loading: true });

function normalize(name) {
  return (name || '').trim().toLowerCase();
}

export function SkillIconProvider({ children }) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get('/skills')
      .then((data) => {
        if (!cancelled) setSkills(data || []);
      })
      .catch(() => {
        if (!cancelled) setSkills([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const iconMap = useMemo(() => {
    const map = {};
    skills.forEach((skill) => {
      if (skill.icon) map[normalize(skill.name)] = skill.icon;
    });
    return map;
  }, [skills]);

  return (
    <SkillIconContext.Provider value={{ iconMap, skills, loading }}>{children}</SkillIconContext.Provider>
  );
}

// Devuelve la URL del ícono para un nombre de tecnología, si existe (cargado desde el admin vía Cloudinary).
export function useSkillIcon(name) {
  const { iconMap } = useContext(SkillIconContext);
  return iconMap[normalize(name)] || null;
}

export function useSkillIcons() {
  return useContext(SkillIconContext);
}
