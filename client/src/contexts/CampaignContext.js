import React, {
  createContext,
  useContext,
  useReducer,
  // useEffect,
  useCallback,
} from "react";
import {
  fetchCampaigns,
  fetchCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from "../services/api";

const CampaignContext = createContext();
const initialState = {
  campaigns: [],
  currentCampaign: null,
  loading: false,
  error: null,
};

const campaignReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: true };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "LOAD_CAMPAIGNS":
      return { ...state, campaigns: action.payload, loading: false };
    case "LOAD_CAMPAIGN":
      return { ...state, currentCampaign: action.payload, loading: false };
    case "UPDATE_CAMPAIGN":
      return {
        ...state,
        currentCampaign: action.payload,
        campaigns: state.campaigns.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case "ADD_CAMPAIGN":
      return {
        ...state,
        campaigns: [...state.campaigns, action.payload],
        loading: false,
      };
    case "DELETE_CAMPAIGN":
      return {
        ...state,
        campaigns: state.campaigns.filter((c) => c.id !== action.payload),
        loading: false,
      };
    default:
      return state;
  }
};

export const CampaignProvider = ({ children }) => {
  const [state, dispatch] = useReducer(campaignReducer, initialState);

  // Memoize functions to prevent recreation on every render
  const getCampaigns = useCallback(async () => {
    dispatch({ type: "SET_LOADING" });
    try {
      const campaigns = await fetchCampaigns();
      dispatch({ type: "LOAD_CAMPAIGNS", payload: campaigns });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  }, []);

  const getCampaign = useCallback(async (id) => {
    dispatch({ type: "SET_LOADING" });
    try {
      const campaign = await fetchCampaign(id);
      dispatch({ type: "LOAD_CAMPAIGN", payload: campaign });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  }, []);

  const addCampaign = useCallback(async (campaignData) => {
    dispatch({ type: "SET_LOADING" });
    try {
      const campaign = await createCampaign(campaignData);
      dispatch({ type: "ADD_CAMPAIGN", payload: campaign });
      return campaign;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  }, []);

  const updateCampaignData = useCallback(async (id, campaignData) => {
    try {
      const campaign = await updateCampaign(id, campaignData);
      dispatch({ type: "UPDATE_CAMPAIGN", payload: campaign });
      return campaign;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  }, []);

  const removeCampaign = useCallback(async (id) => {
    dispatch({ type: "SET_LOADING" });
    try {
      await deleteCampaign(id);
      dispatch({ type: "DELETE_CAMPAIGN", payload: id });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  }, []);

  const setCurrentCampaign = useCallback((campaign) => {
    dispatch({ type: "LOAD_CAMPAIGN", payload: campaign });
  }, []);

  return (
    <CampaignContext.Provider
      value={{
        ...state,
        getCampaigns,
        getCampaign,
        addCampaign,
        updateCampaignData,
        removeCampaign,
        setCurrentCampaign,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error("useCampaign must be used within a CampaignProvider");
  }
  return context;
};
