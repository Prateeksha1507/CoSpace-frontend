import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchEventById } from "../api/eventAPI";
import { fetchOrgById } from "../api/orgAPI"; // to fetch org info linked with event
import EventSection from "../components/EventSection";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [org, setOrg] = useState(null);


  useEffect(() => {
    async function loadEvent() {
      const data = await fetchEventById(id);
      if (!data) return;
      setEvent(data);
      const orgInfo = await fetchOrgById(data.conductingOrgId);
      setOrg(orgInfo);
    }
    loadEvent();
  }, [id]);

  if (!event || !org) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading event...</p>;
  }

  return (
  <EventSection
    banner={event.image}
    name={event.name}
    orgName={org.name}
    orgType={org.type}
    date={event.date}
    isVirtual={event.isVirtual}
    venue={event.venue}
    description={event.description}
    skills={event.skills}
    clickable={true}
    orgId={org._id}
  />  );
}
