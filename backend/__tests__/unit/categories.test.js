describe('Categories Functionality', () => {
  describe('Category Data Processing', () => {
    test('should filter out null and undefined values from categories', () => {
      const mockCategories = ['Web Development', null, 'Data Science', undefined, 'DevOps'];
      const filtered = mockCategories.filter(cat => cat);
      
      expect(filtered).toEqual(['Web Development', 'Data Science', 'DevOps']);
      expect(filtered).toHaveLength(3);
    });

    test('should handle empty array of categories', () => {
      const mockCategories = [];
      const filtered = mockCategories.filter(cat => cat);
      
      expect(filtered).toEqual([]);
      expect(filtered).toHaveLength(0);
    });

    test('should preserve unique categories', () => {
      const mockCategories = ['Web Development', 'Data Science', 'Mobile Development'];
      const uniqueCategories = [...new Set(mockCategories)];
      
      expect(uniqueCategories.length).toBe(mockCategories.length);
      expect(uniqueCategories).toEqual(mockCategories);
    });

    test('should remove duplicate categories if present', () => {
      const mockCategoriesWithDupes = ['Web Development', 'Data Science', 'Web Development', 'DevOps'];
      const uniqueCategories = [...new Set(mockCategoriesWithDupes)];
      
      expect(uniqueCategories).toHaveLength(3);
      expect(uniqueCategories).toEqual(['Web Development', 'Data Science', 'DevOps']);
    });
  });

  describe('Category Icon Mapping', () => {
    test('should map known categories to icons', () => {
      const categoryIconMap = {
        "Web Development": { icon: "Globe", color: "blue" },
        "Data Science": { icon: "TrendingUp", color: "green" },
        "Mobile Development": { icon: "FaMobile", color: "purple" },
      };

      const category = "Web Development";
      const mapping = categoryIconMap[category];

      expect(mapping).toBeDefined();
      expect(mapping.icon).toBe("Globe");
      expect(mapping.color).toBe("blue");
    });

    test('should provide fallback for unknown categories', () => {
      const categoryIconMap = {
        "Web Development": { icon: "Globe", color: "blue" },
      };

      const category = "Unknown Category";
      const mapping = categoryIconMap[category];
      const fallback = { icon: "BookOpen", color: "indigo" };

      const result = mapping || fallback;

      expect(result.icon).toBe("BookOpen");
      expect(result.color).toBe("indigo");
    });
  });
});
