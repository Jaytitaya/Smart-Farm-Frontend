import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { Grid, TextField, Paper, Typography } from "@material-ui/core";
import ReactSpeedometer from "react-d3-speedometer";
import Axios from "axios";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";

function Humid() {

  const paperStyle = {padding: 20,height: "120vh",width: 700,margin: "10px auto",backgroundColor: "#f5f5f5"};
  const paperStyle2 = {padding: 30,height: "20vh",width: 380,margin: "10px auto",backgroundColor: "#f5f5f5"};

  const [sensorread_Temp, setsensorread_Temp] = useState(8);
  const [plantname, setPlantname] = useState("");
  const [Range, setRange] = useState([]);
  const [Lowertemp, setLowertemp] = useState(6);
  const [Highertemp, setHighertemp] = useState(9);
  let [posts, setPosts] = useState([]);
  const getTemp = () => {
    setInterval(() =>{
      Axios.post("http://localhost:3001/getpH",{plantname: plantname},{ withCredentials: true }).then((response) => {
        setsensorread_Temp(response.data[0].Humid);
      });
    },1000);
  };
  const getRange = () => {
    Axios.post("http://localhost:3001/getrangeHumid",{plantname: plantname},{ withCredentials: true }).then((response) => {
      setRange(response.data);
      console.log(response.data);
    });
  };
  const getControllerStatus = () => {
    Axios.post("http://localhost:3001/getControllerHumid",{plantname: plantname},{ withCredentials: true }).then((response) => {
      setChecked1(response.data[0].humidcontrolstrategy);
      setChecked2(response.data[0].humidcontrolstatus);
    });
  }
  const pushControllerStatus = () => {
    if (checked1 == true) {
      Axios.post("http://localhost:3001/pushControllerHumid",{ plantname: plantname, humidcontrolstrategy: checked1 },{ withCredentials: true })
    }
    else {
      Axios.post("http://localhost:3001/pushControllerHumid",{ plantname: plantname, humidcontrolstrategy: checked1},{ withCredentials: true })
      Axios.post("http://localhost:3001/manualpushControllerHumid",{ plantname: plantname, humidcontrolstatus: checked2},{ withCredentials: true })
    }
  }
  const WrapperFn = () => {
    getTemp();
    getRange();
    setLowertemp(Range[0].lowerhumid);
    setHighertemp(Range[0].higherhumid);
    getControllerStatus();
  };

  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);

  const handleChangeManual = (event) => {setChecked1(event.target.checked)};
  const handleChangeControll = (event) => {setChecked2(event.target.checked)};
  const handleChange = (event) => {setPlantname(event.target.value);//console.log(plantname)
  };
  useEffect(() => {
    async function getResults() {
      const results = await Axios("http://localhost:3001/plantname",{ withCredentials: true });
      setPosts(results.data);
    }
    getResults();
  }, []);
  console.log(posts);
  return (
    <Grid align="center">
      <Navbar />
      <Paper elevation={0} style={paperStyle}>

        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={2}><img className="homephoto" src="/Humidity.png" /></Grid>
          <Grid item xs={3}><h2 className="app-front" style={{ color: "#008000" }}>Humidity</h2></Grid>
        </Grid>

        <Grid container rowSpacing={4} direction="row" justifyContent="center" alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="demo-simple-select-label">Plant name</InputLabel>
              <Select style={{ minWidth: "220px" }} labelId="demo-multiple-name-label" id="demo-multiple-name" value={plantname} label="plantname" input={<OutlinedInput label="plantname" />} onChange={handleChange}>
                {posts.map((posts) => (<MenuItem key={posts} value={posts}>{posts}</MenuItem>))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button onClick={WrapperFn} variant="contained" color="success" size="large" sx={{ mt: 3, mb: 2 }} style={{ minWidth: "210px" }}>
              Show information
            </Button>
          </Grid>
        </Grid>

        <c>Humid Controller</c>
        <Paper elevation={6} style={paperStyle2}>
          <Grid container spacing={2} direction="row" justifyContent="center" alignItems="center">
            <Grid item xs={4} className="clight">Auto control</Grid>
            <Grid item xs={1}><Switch onClick={handleChangeManual} checked={checked1} /></Grid>
            <Grid item xs={6} className="clight">Manual control</Grid>
          </Grid>

          <Grid container spacing={5} direction="row" justifyContent="center" alignItems="center">
            <Grid className="clight" item xs={2}>Fan</Grid>
            <Grid item xs={2} className="clight">Off</Grid>
            <Switch onClick={handleChangeControll} checked={checked2} disabled={!checked1}/>
            <Grid item xs={2} className="clight">On</Grid>
          </Grid>

          <Grid container spacing={2} direction="column" justifyContent="center" alignItems="center">
            <Button variant="contained" color="success" size="large" sx={{ mt: 3, mb: 2 }} style={{ minWidth: "100px" }} onClick={pushControllerStatus}>
              Save
            </Button>
          </Grid>

        </Paper>
        
        <ReactSpeedometer
          value={sensorread_Temp}
          width={400}
          height={400}
          minValue={Lowertemp + (Lowertemp - Highertemp)}
          maxValue={Highertemp + (Highertemp - Lowertemp)}
          valueTextFontSize={20}
          needleColor="#662200"
          needleTransitionDuration={2222}
          needleTransition="easeElastic"
          segments={3}
          paddingVertical={10}
          segmentColors={["#b3ff66", "#00b300", "#e6b800"]}
          forceRender={1}
          customSegmentLabels={[
            {
              text: "Low Temp",
              position: "OUTSIDE",
              color: "#555",
              fontSize: "16px",
            },
            {
              text: "Normal Temp",
              position: "OUTSIDE",
              color: "#555",
              fontSize: "16px",
            },
            {
              text: "High Temp",
              position: "OUTSIDE",
              color: "#555",
              fontSize: "1ู6px",
            },
          ]}
        />
      </Paper>
    </Grid>
  );
}
export default Humid;
