import UserAccount from "@/components/UserAccount";
import UserJournal from "@/components/UserJournal";
import UserWallet from "@/components/UserWallet";
import keycloak from "@/keycloak";
import { useState } from "react";

const DashboardPage = () => {
  const [currentView, setCurrentView] = useState("wallet");

  return (
    <div className="min-h-full bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
              <p className="text-lg text-gray-600">
                Benvenuto, <span className="font-semibold">{keycloak.tokenParsed?.preferred_username}</span>
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentView("wallet")}
                disabled={currentView === "wallet"}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Wallet
              </button>
              <button
                onClick={() => setCurrentView("profile")}
                disabled={currentView === "profile"}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Profilo
              </button>
            </div>
          </div>
        </div>
        {currentView === "wallet" && <UserWallet />}
        {currentView === "wallet" && <UserJournal />}
        {currentView === "profile" && <UserAccount />}
      </div>
    </div>
  );
}

export default DashboardPage;