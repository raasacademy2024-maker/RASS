import React from "react";
import { motion } from "framer-motion";
import { resolveImageUrl } from "../../utils/imageUrl";

export interface Company {
  name: string;
  logo?: string;
}

interface Props {
  companies: Company[];
}

const DreamCompanies: React.FC<Props> = ({ companies }) => {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 text-center">Your Dream Companies</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {companies.map((c, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-lg shadow border flex flex-col items-center justify-center w-40 h-28"
          >
            {c.logo ? (
              <img
                src={resolveImageUrl(c.logo, 400)}
                alt={c.name}
                className="max-h-12 object-contain mb-2"
              />
            ) : (
              <span className="text-sm text-gray-700">{c.name}</span>
            )}
            <span className="text-xs text-gray-500">{c.name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default DreamCompanies;
