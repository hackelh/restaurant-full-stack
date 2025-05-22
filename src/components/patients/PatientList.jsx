import React from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit } from 'react-icons/fa';

const PatientList = ({ patients }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nom
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prénom
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {patient.nom}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {patient.prenom}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link 
                  to={`/patients/${patient.id}`} 
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  <FaEye className="inline-block" />
                </Link>
                <Link 
                  to={`/patients/${patient.id}/modifier`} 
                  className="text-blue-600 hover:text-blue-900"
                >
                  <FaEdit className="inline-block" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;
