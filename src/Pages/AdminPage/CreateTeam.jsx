import React, { useState } from "react";

const CreateTeam = () => {
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState([""]);

  const handleMemberChange = (index, value) => {
    const updatedMembers = [...members];
    updatedMembers[index] = value;
    setMembers(updatedMembers);
  };

  const addMember = () => {
    if (members.length < 5) setMembers([...members, ""]);
  };

  const removeMember = (index) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  return (
    <div className=" bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Create a Team</h2>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Team Name</label>
          <input
            type="text"
            placeholder="Enter team name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Team Members</label>
          {members.map((member, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="email"
                placeholder="Enter member email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={member}
                onChange={(e) => handleMemberChange(index, e.target.value)}
              />
              {members.length > 1 && (
                <button className="text-red-500 hover:text-red-700" onClick={() => removeMember(index)}>
                  ❌
                </button>
              )}
            </div>
          ))}
          <button
            className="mt-2 text-blue-600 hover:underline"
            onClick={addMember}
            disabled={members.length >= 5}
          >
            + Add Member
          </button>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => window.history.back()}
            className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            className={`px-5 py-2 rounded-lg transition ${
              teamName && members.every((m) => m)
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!teamName || !members.every((m) => m)}
          >
            Create Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;
