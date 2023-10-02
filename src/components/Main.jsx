import { useEffect, useState } from "react";

import {
  apiGetAllCandidates,
  apiGetAllCities,
  apiGetAllElection,
} from "../service/apiService";

import Panel from "./Panel";
import SelectionCity from "./SelectCity";

export default function Main() {
  const [loading, setLoading] = useState(true);

  const [allCities, setAllCities] = useState([]);
  const [selectCity, setSelectCity] = useState("Asgard");
  const [allCandidates, setAllCandidates] = useState([]);
  const [allElection, setAllElection] = useState([]);
  const [winner, setWinner] = useState("");

  const filteredCity = allCities.filter((city) =>
    city.name.includes(selectCity)
  );
  const city = { ...filteredCity[0] };

  // const filteredElection = allElection.filter((election) =>
  //   election.cityId.includes(city.id)
  // );

  useEffect(() => {
    async function getAllCities() {
      try {
        const backEndAllCities = await apiGetAllCities();

        setAllCities(backEndAllCities);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.log(error.message);
      }
    }
    getAllCities();
  }, []);

  useEffect(() => {
    async function getAllCandidates() {
      try {
        const backEndAllCandidates = await apiGetAllCandidates();

        setAllCandidates(backEndAllCandidates);
      } catch (error) {
        console.log(error.message);
      }
    }
    getAllCandidates();
  }, []);

  useEffect(() => {
    async function getAllElection() {
      try {
        const backEndAllElection = await apiGetAllElection(city.id);

        setAllElection(backEndAllElection);
        setWinner(backEndAllElection[0].candidateId);
      } catch (error) {
        console.log(error.message);
      }
    }
    getAllElection();
  }, [city.id]);

  function handleSelectCity(city) {
    setSelectCity(city);
  }

  let mainJsx = <div className="flex justify-center my-4">Loading...</div>;

  if (!loading) {
    mainJsx = (
      <div className="text-center">
        <SelectionCity selectCity={handleSelectCity}>{allCities}</SelectionCity>

        <Panel
          election={allElection}
          candidates={allCandidates}
          winner={winner}
        >
          {city}
        </Panel>
      </div>
    );
  }

  return <>{mainJsx}</>;
}