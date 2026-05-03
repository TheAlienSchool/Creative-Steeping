import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { LocalHonoringsRegistry } from './GenerationalHonoringsRegistry';

export function useHonorings() {
  const [registry, setRegistry] = useState(LocalHonoringsRegistry);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHonorings = async () => {
      try {
        // Attempt to fetch from Supabase if table exists
        // The table should be called `generational_honorings`
        // with columns: term (unique string), elder, tradition, lineage, transmission, frequency_hz
        const { data, error } = await supabase
          .from('generational_honorings')
          .select('*');

        if (error) {
          if (error.code === 'PGRST116' || error.code === '42P01') {
             // Table doesn't exist yet, we silently fallback to local
             console.log("Generational Honorings table not found in Supabase. Using local registry.");
          } else {
             console.warn('Error fetching generational honorings:', error);
          }
        } else if (data && data.length > 0) {
          const mergedRegistry = { ...LocalHonoringsRegistry };
          data.forEach(item => {
            mergedRegistry[item.term.toLowerCase()] = {
              elder: item.elder,
              tradition: item.tradition,
              lineage: item.lineage,
              transmission: item.transmission,
              frequencyHz: item.frequency_hz || 174
            };
          });
          setRegistry(mergedRegistry);
        }
      } catch (err) {
         console.error("Exception checking Supabase for honorings:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHonorings();
  }, []);

  return { registry, isLoading };
}
