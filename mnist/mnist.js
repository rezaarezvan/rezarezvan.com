
if (!navigator.gpu) throw new Error("WebGPU not supported.");
const adapter = await navigator.gpu.requestAdapter();
const device = await adapter.requestDevice({
	requiredFeatures: adapter.features.has("shader-f16") ? ["shader-f16"] : [],
	powerPreference: "high-performance",
  requiredLimits: {maxStorageBufferBindingSize: 147456, maxBufferSize: 147456},
});

const model = (() => {
const getTensorBuffer = (safetensorBuffer, tensorMetadata) => {
  return safetensorBuffer.subarray(...tensorMetadata.data_offsets);
};

const getTensorMetadata = (safetensorBuffer) => {
    const metadataLength = Number(new DataView(safetensorBuffer.buffer).getBigUint64(0, true));
    const metadata = JSON.parse(new TextDecoder("utf8").decode(safetensorBuffer.subarray(8, 8 + metadataLength)));
    return Object.fromEntries(Object.entries(metadata).filter(([k, v]) => k !== "__metadata__").map(([k, v]) => [k, {...v, data_offsets: v.data_offsets.map(x => 8 + metadataLength + x)}]));
};

const createEmptyBuf = (device, size) => {
    return device.createBuffer({size, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST });
};

const createUniformBuf = (device, size) => {
  return device.createBuffer({size, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST})
}

const createInfinityUniformBuf = (device) => {
  const size = 4;
  const buf = device.createBuffer({
    mappedAtCreation: true,
    size,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
  });
  new Float32Array(buf.getMappedRange())[0] = Infinity;
  buf.unmap();
  return buf;
};

const createWeightBuf = (device, size, data) => {
  const buf = device.createBuffer({ size, usage: GPUBufferUsage.STORAGE, mappedAtCreation: true });
  new Uint8Array(buf.getMappedRange()).set(data); buf.unmap();
  return buf;
};

const addComputePass = (device, commandEncoder, pipeline, layout, infinityUniformBuf, bufs, workgroup) => {
  const bindGroup = device.createBindGroup({
    layout: layout,
    entries: [
      { binding: 0, resource: { buffer: infinityUniformBuf } },
      ...bufs.map((buffer, index) => ({ binding: index + 1, resource: { buffer } }))
    ]
  });

  const passEncoder = commandEncoder.beginComputePass();
  passEncoder.setPipeline(pipeline);
  passEncoder.setBindGroup(0, bindGroup);
  passEncoder.dispatchWorkgroups(...workgroup);
  passEncoder.end();
};

const r_4_3_2_8_8_5_3_4_5 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@compute @workgroup_size(2,8,8) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 3 */
  var gidx1 = i32(gindex.y); /* 4 */
  var lidx0 = i32(lindex.x); /* 2 */
  var lidx1 = i32(lindex.y); /* 8 */
  var lidx2 = i32(lindex.z); /* 8 */
  var alu0 = (lidx2*3);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  for (var ridx0 = 0; ridx0 < 5; ridx0++) {
    var alu1 = ((ridx0*5)+(gidx1*200)+(lidx0*100));
    var val0 = data2[alu1];
    var alu2 = ((ridx0*28)+alu0+(gidx0*224)+(lidx1*28));
    var val1 = data1[alu2];
    var val2 = data2[(alu1+1)];
    var val3 = data2[(alu1+2)];
    var val4 = data2[(alu1+3)];
    var val5 = data2[(alu1+4)];
    var val6 = data2[(alu1+25)];
    var val7 = data2[(alu1+26)];
    var val8 = data2[(alu1+27)];
    var val9 = data2[(alu1+28)];
    var val10 = data2[(alu1+29)];
    var val11 = data2[(alu1+50)];
    var val12 = data2[(alu1+51)];
    var val13 = data2[(alu1+52)];
    var val14 = data2[(alu1+53)];
    var val15 = data2[(alu1+54)];
    var val16 = data2[(alu1+75)];
    var val17 = data2[(alu1+76)];
    var val18 = data2[(alu1+77)];
    var val19 = data2[(alu1+78)];
    var val20 = data2[(alu1+79)];
    var val21 = data1[(alu2+1)];
    var val22 = data1[(alu2+2)];
    var val23 = data1[(alu2+3)];
    var val24 = data1[(alu2+4)];
    var val25 = data1[(alu2+5)];
    var val26 = data1[(alu2+6)];
    acc0 = (acc0+(val1*val0)+(val21*val2)+(val22*val3)+(val23*val4)+(val24*val5));
    acc1 = (acc1+(val1*val6)+(val21*val7)+(val22*val8)+(val23*val9)+(val24*val10));
    acc2 = (acc2+(val1*val11)+(val21*val12)+(val22*val13)+(val23*val14)+(val24*val15));
    acc3 = (acc3+(val1*val16)+(val21*val17)+(val22*val18)+(val23*val19)+(val24*val20));
    acc4 = (acc4+(val21*val0)+(val22*val2)+(val23*val3)+(val24*val4)+(val25*val5));
    acc5 = (acc5+(val21*val6)+(val22*val7)+(val23*val8)+(val24*val9)+(val25*val10));
    acc6 = (acc6+(val21*val11)+(val22*val12)+(val23*val13)+(val24*val14)+(val25*val15));
    acc7 = (acc7+(val21*val16)+(val22*val17)+(val23*val18)+(val24*val19)+(val25*val20));
    acc8 = (acc8+(val22*val0)+(val23*val2)+(val24*val3)+(val25*val4)+(val26*val5));
    acc9 = (acc9+(val22*val6)+(val23*val7)+(val24*val8)+(val25*val9)+(val26*val10));
    acc10 = (acc10+(val22*val11)+(val23*val12)+(val24*val13)+(val25*val14)+(val26*val15));
    acc11 = (acc11+(val22*val16)+(val23*val17)+(val24*val18)+(val25*val19)+(val26*val20));
  }
  var precast0 = gidx1;
  var precast1 = lidx0;
  var precast2 = (bitcast<u32>(precast0)<<3u);
  var precast3 = (bitcast<u32>(precast1)<<2u);
  var alu16 = (bitcast<i32>(precast2)+bitcast<i32>(precast3));
  var val27 = data3[alu16];
  var val28 = data3[(alu16+1)];
  var val29 = data3[(alu16+2)];
  var val30 = data3[(alu16+3)];
  var alu17 = (alu0+(lidx1*24)+(lidx0*2304)+(gidx0*192)+(gidx1*4608));
  var alu18 = (acc0+val27);
  var alu19 = (acc1+val28);
  var alu20 = (acc2+val29);
  var alu21 = (acc3+val30);
  var alu22 = (acc4+val27);
  var alu23 = (acc5+val28);
  var alu24 = (acc6+val29);
  var alu25 = (acc7+val30);
  var alu26 = (acc8+val27);
  var alu27 = (acc9+val28);
  var alu28 = (acc10+val29);
  var alu29 = (acc11+val30);
  data0[alu17] = select(0.0f,alu18,(0.0f<alu18));
  data0[(alu17+576)] = select(0.0f,alu19,(0.0f<alu19));
  data0[(alu17+1152)] = select(0.0f,alu20,(0.0f<alu20));
  data0[(alu17+1728)] = select(0.0f,alu21,(0.0f<alu21));
  data0[(alu17+1)] = select(0.0f,alu22,(0.0f<alu22));
  data0[(alu17+577)] = select(0.0f,alu23,(0.0f<alu23));
  data0[(alu17+1153)] = select(0.0f,alu24,(0.0f<alu24));
  data0[(alu17+1729)] = select(0.0f,alu25,(0.0f<alu25));
  data0[(alu17+2)] = select(0.0f,alu26,(0.0f<alu26));
  data0[(alu17+578)] = select(0.0f,alu27,(0.0f<alu27));
  data0[(alu17+1154)] = select(0.0f,alu28,(0.0f<alu28));
  data0[(alu17+1730)] = select(0.0f,alu29,(0.0f<alu29));
}`;

const r_5_5_8_4_32_5_4_4_5 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@compute @workgroup_size(8,4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 5 */
  var gidx1 = i32(gindex.y); /* 5 */
  var lidx0 = i32(lindex.x); /* 8 */
  var lidx1 = i32(lindex.y); /* 4 */
  var precast0 = gidx0;
  var precast1 = (bitcast<u32>(precast0)<<2u);
  var cast0 = bitcast<i32>(precast1);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  var acc12 = 0.0f;
  var acc13 = 0.0f;
  var acc14 = 0.0f;
  var acc15 = 0.0f;
  for (var ridx0 = 0; ridx0 < 32; ridx0++) {
    for (var ridx1 = 0; ridx1 < 5; ridx1++) {
      var alu0 = ((ridx1*5)+(lidx0*3200)+(ridx0*25));
      var val0 = data2[alu0];
      var alu1 = ((ridx1*24)+(ridx0*576)+(lidx1*24)+cast0+(gidx1*96));
      var val1 = data1[alu1];
      var val2 = data2[(alu0+1)];
      var val3 = data2[(alu0+2)];
      var val4 = data2[(alu0+3)];
      var val5 = data2[(alu0+4)];
      var val6 = data2[(alu0+800)];
      var val7 = data2[(alu0+801)];
      var val8 = data2[(alu0+802)];
      var val9 = data2[(alu0+803)];
      var val10 = data2[(alu0+804)];
      var val11 = data2[(alu0+1600)];
      var val12 = data2[(alu0+1601)];
      var val13 = data2[(alu0+1602)];
      var val14 = data2[(alu0+1603)];
      var val15 = data2[(alu0+1604)];
      var val16 = data2[(alu0+2400)];
      var val17 = data2[(alu0+2401)];
      var val18 = data2[(alu0+2402)];
      var val19 = data2[(alu0+2403)];
      var val20 = data2[(alu0+2404)];
      var val21 = data1[(alu1+1)];
      var val22 = data1[(alu1+2)];
      var val23 = data1[(alu1+3)];
      var val24 = data1[(alu1+4)];
      var val25 = data1[(alu1+5)];
      var val26 = data1[(alu1+6)];
      var val27 = data1[(alu1+7)];
      acc0 = (acc0+(val1*val0)+(val21*val2)+(val22*val3)+(val23*val4)+(val24*val5));
      acc1 = (acc1+(val1*val6)+(val21*val7)+(val22*val8)+(val23*val9)+(val24*val10));
      acc2 = (acc2+(val1*val11)+(val21*val12)+(val22*val13)+(val23*val14)+(val24*val15));
      acc3 = (acc3+(val1*val16)+(val21*val17)+(val22*val18)+(val23*val19)+(val24*val20));
      acc4 = (acc4+(val21*val0)+(val22*val2)+(val23*val3)+(val24*val4)+(val25*val5));
      acc5 = (acc5+(val21*val6)+(val22*val7)+(val23*val8)+(val24*val9)+(val25*val10));
      acc6 = (acc6+(val21*val11)+(val22*val12)+(val23*val13)+(val24*val14)+(val25*val15));
      acc7 = (acc7+(val21*val16)+(val22*val17)+(val23*val18)+(val24*val19)+(val25*val20));
      acc8 = (acc8+(val22*val0)+(val23*val2)+(val24*val3)+(val25*val4)+(val26*val5));
      acc9 = (acc9+(val22*val6)+(val23*val7)+(val24*val8)+(val25*val9)+(val26*val10));
      acc10 = (acc10+(val22*val11)+(val23*val12)+(val24*val13)+(val25*val14)+(val26*val15));
      acc11 = (acc11+(val22*val16)+(val23*val17)+(val24*val18)+(val25*val19)+(val26*val20));
      acc12 = (acc12+(val23*val0)+(val24*val2)+(val25*val3)+(val26*val4)+(val27*val5));
      acc13 = (acc13+(val23*val6)+(val24*val7)+(val25*val8)+(val26*val9)+(val27*val10));
      acc14 = (acc14+(val23*val11)+(val24*val12)+(val25*val13)+(val26*val14)+(val27*val15));
      acc15 = (acc15+(val23*val16)+(val24*val17)+(val25*val18)+(val26*val19)+(val27*val20));
    }
  }
  var precast2 = lidx0;
  var precast3 = (bitcast<u32>(precast2)<<2u);
  var cast1 = bitcast<i32>(precast3);
  var val28 = data3[cast1];
  var val29 = data3[(cast1+1)];
  var val30 = data3[(cast1+2)];
  var val31 = data3[(cast1+3)];
  var alu20 = ((lidx1*20)+(lidx0*1600)+cast0+(gidx1*80));
  data0[alu20] = (acc0+val28);
  data0[(alu20+400)] = (acc1+val29);
  data0[(alu20+800)] = (acc2+val30);
  data0[(alu20+1200)] = (acc3+val31);
  data0[(alu20+1)] = (acc4+val28);
  data0[(alu20+401)] = (acc5+val29);
  data0[(alu20+801)] = (acc6+val30);
  data0[(alu20+1201)] = (acc7+val31);
  data0[(alu20+2)] = (acc8+val28);
  data0[(alu20+402)] = (acc9+val29);
  data0[(alu20+802)] = (acc10+val30);
  data0[(alu20+1202)] = (acc11+val31);
  data0[(alu20+3)] = (acc12+val28);
  data0[(alu20+403)] = (acc13+val29);
  data0[(alu20+803)] = (acc14+val30);
  data0[(alu20+1203)] = (acc15+val31);
}`;

const r_5_5_8_2_2_4_2_2 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<f32>;
@compute @workgroup_size(8,2,2) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 5 */
  var gidx1 = i32(gindex.y); /* 5 */
  var lidx0 = i32(lindex.x); /* 8 */
  var lidx1 = i32(lindex.y); /* 2 */
  var lidx2 = i32(lindex.z); /* 2 */
  var precast0 = gidx0;
  var precast1 = lidx0;
  var precast2 = lidx2;
  var cast0 = bitcast<u32>(precast0);
  var precast3 = (cast0<<2u);
  var precast4 = (bitcast<u32>(precast1)<<2u);
  var cast1 = bitcast<i32>(precast4);
  var val0 = data2[cast1];
  var val1 = data3[cast1];
  var val2 = data4[cast1];
  var val3 = data5[cast1];
  var precast5 = (bitcast<u32>(precast2)<<1u);
  var alu0 = (cast1+1);
  var val4 = data2[alu0];
  var val5 = data3[alu0];
  var val6 = data4[alu0];
  var val7 = data5[alu0];
  var alu1 = (cast1+2);
  var val8 = data2[alu1];
  var val9 = data3[alu1];
  var val10 = data4[alu1];
  var val11 = data5[alu1];
  var alu2 = (cast1+3);
  var val12 = data2[alu2];
  var val13 = data3[alu2];
  var val14 = data4[alu2];
  var val15 = data5[alu2];
  var alu3 = (bitcast<i32>(precast5)+(lidx1*40)+(lidx0*1600)+bitcast<i32>(precast3)+(gidx1*80));
  var val16 = data1[alu3];
  var val17 = data1[(alu3+1)];
  var val18 = data1[(alu3+20)];
  var val19 = data1[(alu3+21)];
  var val20 = data1[(alu3+400)];
  var val21 = data1[(alu3+401)];
  var val22 = data1[(alu3+420)];
  var val23 = data1[(alu3+421)];
  var val24 = data1[(alu3+800)];
  var val25 = data1[(alu3+801)];
  var val26 = data1[(alu3+820)];
  var val27 = data1[(alu3+821)];
  var val28 = data1[(alu3+1200)];
  var val29 = data1[(alu3+1201)];
  var val30 = data1[(alu3+1220)];
  var val31 = data1[(alu3+1221)];
  var precast6 = (cast0<<1u);
  var alu4 = (lidx2+(lidx1*10)+(lidx0*400)+bitcast<i32>(precast6)+(gidx1*20));
  var alu5 = (1/sqrt((val2+1e-05f)));
  var alu6 = (1/sqrt((val6+1e-05f)));
  var alu7 = (1/sqrt((val10+1e-05f)));
  var alu8 = (1/sqrt((val14+1e-05f)));
  var alu9 = (((select(0.0f,val16,(0.0f<val16))-val0)*val1*alu5)+val3);
  var alu10 = (((select(0.0f,val17,(0.0f<val17))-val0)*val1*alu5)+val3);
  var alu11 = (((select(0.0f,val18,(0.0f<val18))-val0)*val1*alu5)+val3);
  var alu12 = select(alu9,alu11,(alu9<alu11));
  var alu13 = select(alu12,alu10,(alu12<alu10));
  var alu14 = (((select(0.0f,val19,(0.0f<val19))-val0)*val1*alu5)+val3);
  data0[alu4] = select(alu13,alu14,(alu13<alu14));
  var alu16 = (((select(0.0f,val20,(0.0f<val20))-val4)*val5*alu6)+val7);
  var alu17 = (((select(0.0f,val21,(0.0f<val21))-val4)*val5*alu6)+val7);
  var alu18 = (((select(0.0f,val22,(0.0f<val22))-val4)*val5*alu6)+val7);
  var alu19 = select(alu16,alu18,(alu16<alu18));
  var alu20 = select(alu19,alu17,(alu19<alu17));
  var alu21 = (((select(0.0f,val23,(0.0f<val23))-val4)*val5*alu6)+val7);
  data0[(alu4+100)] = select(alu20,alu21,(alu20<alu21));
  var alu23 = (((select(0.0f,val24,(0.0f<val24))-val8)*val9*alu7)+val11);
  var alu24 = (((select(0.0f,val25,(0.0f<val25))-val8)*val9*alu7)+val11);
  var alu25 = (((select(0.0f,val26,(0.0f<val26))-val8)*val9*alu7)+val11);
  var alu26 = select(alu23,alu25,(alu23<alu25));
  var alu27 = select(alu26,alu24,(alu26<alu24));
  var alu28 = (((select(0.0f,val27,(0.0f<val27))-val8)*val9*alu7)+val11);
  data0[(alu4+200)] = select(alu27,alu28,(alu27<alu28));
  var alu30 = (((select(0.0f,val28,(0.0f<val28))-val12)*val13*alu8)+val15);
  var alu31 = (((select(0.0f,val29,(0.0f<val29))-val12)*val13*alu8)+val15);
  var alu32 = (((select(0.0f,val30,(0.0f<val30))-val12)*val13*alu8)+val15);
  var alu33 = select(alu30,alu32,(alu30<alu32));
  var alu34 = select(alu33,alu31,(alu33<alu31));
  var alu35 = (((select(0.0f,val31,(0.0f<val31))-val12)*val13*alu8)+val15);
  data0[(alu4+300)] = select(alu34,alu35,(alu34<alu35));
}`;

const r_2_8_8_2_32_4_4_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@compute @workgroup_size(8,8,2) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 2 */
  var lidx0 = i32(lindex.x); /* 8 */
  var lidx1 = i32(lindex.y); /* 8 */
  var lidx2 = i32(lindex.z); /* 2 */
  var precast0 = lidx2;
  var precast1 = (bitcast<u32>(precast0)<<2u);
  var cast0 = bitcast<i32>(precast1);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  var acc12 = 0.0f;
  var acc13 = 0.0f;
  var acc14 = 0.0f;
  var acc15 = 0.0f;
  for (var ridx0 = 0; ridx0 < 32; ridx0++) {
    var alu0 = ((ridx0*9)+(gidx0*9216)+(lidx0*1152));
    var val0 = data2[alu0];
    var alu1 = ((ridx0*100)+(lidx1*10)+cast0);
    var val1 = data1[alu1];
    var val2 = data2[(alu0+1)];
    var val3 = data2[(alu0+2)];
    var val4 = data2[(alu0+3)];
    var val5 = data2[(alu0+4)];
    var val6 = data2[(alu0+5)];
    var val7 = data2[(alu0+6)];
    var val8 = data2[(alu0+7)];
    var val9 = data2[(alu0+8)];
    var val10 = data2[(alu0+288)];
    var val11 = data2[(alu0+289)];
    var val12 = data2[(alu0+290)];
    var val13 = data2[(alu0+291)];
    var val14 = data2[(alu0+292)];
    var val15 = data2[(alu0+293)];
    var val16 = data2[(alu0+294)];
    var val17 = data2[(alu0+295)];
    var val18 = data2[(alu0+296)];
    var val19 = data2[(alu0+576)];
    var val20 = data2[(alu0+577)];
    var val21 = data2[(alu0+578)];
    var val22 = data2[(alu0+579)];
    var val23 = data2[(alu0+580)];
    var val24 = data2[(alu0+581)];
    var val25 = data2[(alu0+582)];
    var val26 = data2[(alu0+583)];
    var val27 = data2[(alu0+584)];
    var val28 = data2[(alu0+864)];
    var val29 = data2[(alu0+865)];
    var val30 = data2[(alu0+866)];
    var val31 = data2[(alu0+867)];
    var val32 = data2[(alu0+868)];
    var val33 = data2[(alu0+869)];
    var val34 = data2[(alu0+870)];
    var val35 = data2[(alu0+871)];
    var val36 = data2[(alu0+872)];
    var val37 = data1[(alu1+1)];
    var val38 = data1[(alu1+2)];
    var val39 = data1[(alu1+3)];
    var val40 = data1[(alu1+4)];
    var val41 = data1[(alu1+5)];
    var val42 = data1[(alu1+10)];
    var val43 = data1[(alu1+11)];
    var val44 = data1[(alu1+12)];
    var val45 = data1[(alu1+13)];
    var val46 = data1[(alu1+14)];
    var val47 = data1[(alu1+15)];
    var val48 = data1[(alu1+20)];
    var val49 = data1[(alu1+21)];
    var val50 = data1[(alu1+22)];
    var val51 = data1[(alu1+23)];
    var val52 = data1[(alu1+24)];
    var val53 = data1[(alu1+25)];
    acc0 = (acc0+(val1*val0)+(val42*val4)+(val48*val7)+(val37*val2)+(val43*val5)+(val49*val8)+(val38*val3)+(val44*val6)+(val50*val9));
    acc1 = (acc1+(val1*val10)+(val42*val13)+(val48*val16)+(val37*val11)+(val43*val14)+(val49*val17)+(val38*val12)+(val44*val15)+(val50*val18));
    acc2 = (acc2+(val1*val19)+(val42*val22)+(val48*val25)+(val37*val20)+(val43*val23)+(val49*val26)+(val38*val21)+(val44*val24)+(val50*val27));
    acc3 = (acc3+(val1*val28)+(val42*val31)+(val48*val34)+(val37*val29)+(val43*val32)+(val49*val35)+(val38*val30)+(val44*val33)+(val50*val36));
    acc4 = (acc4+(val37*val0)+(val43*val4)+(val49*val7)+(val38*val2)+(val44*val5)+(val50*val8)+(val39*val3)+(val45*val6)+(val51*val9));
    acc5 = (acc5+(val37*val10)+(val43*val13)+(val49*val16)+(val38*val11)+(val44*val14)+(val50*val17)+(val39*val12)+(val45*val15)+(val51*val18));
    acc6 = (acc6+(val37*val19)+(val43*val22)+(val49*val25)+(val38*val20)+(val44*val23)+(val50*val26)+(val39*val21)+(val45*val24)+(val51*val27));
    acc7 = (acc7+(val37*val28)+(val43*val31)+(val49*val34)+(val38*val29)+(val44*val32)+(val50*val35)+(val39*val30)+(val45*val33)+(val51*val36));
    acc8 = (acc8+(val38*val0)+(val44*val4)+(val50*val7)+(val39*val2)+(val45*val5)+(val51*val8)+(val40*val3)+(val46*val6)+(val52*val9));
    acc9 = (acc9+(val38*val10)+(val44*val13)+(val50*val16)+(val39*val11)+(val45*val14)+(val51*val17)+(val40*val12)+(val46*val15)+(val52*val18));
    acc10 = (acc10+(val38*val19)+(val44*val22)+(val50*val25)+(val39*val20)+(val45*val23)+(val51*val26)+(val40*val21)+(val46*val24)+(val52*val27));
    acc11 = (acc11+(val38*val28)+(val44*val31)+(val50*val34)+(val39*val29)+(val45*val32)+(val51*val35)+(val40*val30)+(val46*val33)+(val52*val36));
    acc12 = (acc12+(val39*val0)+(val45*val4)+(val51*val7)+(val40*val2)+(val46*val5)+(val52*val8)+(val41*val3)+(val47*val6)+(val53*val9));
    acc13 = (acc13+(val39*val10)+(val45*val13)+(val51*val16)+(val40*val11)+(val46*val14)+(val52*val17)+(val41*val12)+(val47*val15)+(val53*val18));
    acc14 = (acc14+(val39*val19)+(val45*val22)+(val51*val25)+(val40*val20)+(val46*val23)+(val52*val26)+(val41*val21)+(val47*val24)+(val53*val27));
    acc15 = (acc15+(val39*val28)+(val45*val31)+(val51*val34)+(val40*val29)+(val46*val32)+(val52*val35)+(val41*val30)+(val47*val33)+(val53*val36));
  }
  var precast2 = gidx0;
  var precast3 = lidx0;
  var cast1 = bitcast<u32>(precast2);
  var cast2 = bitcast<u32>(precast3);
  var precast4 = (cast1<<5u);
  var precast5 = (cast2<<2u);
  var alu19 = (bitcast<i32>(precast4)+bitcast<i32>(precast5));
  var val54 = data3[alu19];
  var val55 = data3[(alu19+1)];
  var val56 = data3[(alu19+2)];
  var val57 = data3[(alu19+3)];
  var precast6 = lidx1;
  var precast7 = (cast1<<11u);
  var precast8 = (cast2<<8u);
  var precast9 = (bitcast<u32>(precast6)<<3u);
  var alu20 = (cast0+bitcast<i32>(precast9)+bitcast<i32>(precast7)+bitcast<i32>(precast8));
  var alu21 = (acc0+val54);
  var alu22 = (acc1+val55);
  var alu23 = (acc2+val56);
  var alu24 = (acc3+val57);
  var alu25 = (acc4+val54);
  var alu26 = (acc5+val55);
  var alu27 = (acc6+val56);
  var alu28 = (acc7+val57);
  var alu29 = (acc8+val54);
  var alu30 = (acc9+val55);
  var alu31 = (acc10+val56);
  var alu32 = (acc11+val57);
  var alu33 = (acc12+val54);
  var alu34 = (acc13+val55);
  var alu35 = (acc14+val56);
  var alu36 = (acc15+val57);
  data0[alu20] = select(0.0f,alu21,(0.0f<alu21));
  data0[(alu20+64)] = select(0.0f,alu22,(0.0f<alu22));
  data0[(alu20+128)] = select(0.0f,alu23,(0.0f<alu23));
  data0[(alu20+192)] = select(0.0f,alu24,(0.0f<alu24));
  data0[(alu20+1)] = select(0.0f,alu25,(0.0f<alu25));
  data0[(alu20+65)] = select(0.0f,alu26,(0.0f<alu26));
  data0[(alu20+129)] = select(0.0f,alu27,(0.0f<alu27));
  data0[(alu20+193)] = select(0.0f,alu28,(0.0f<alu28));
  data0[(alu20+2)] = select(0.0f,alu29,(0.0f<alu29));
  data0[(alu20+66)] = select(0.0f,alu30,(0.0f<alu30));
  data0[(alu20+130)] = select(0.0f,alu31,(0.0f<alu31));
  data0[(alu20+194)] = select(0.0f,alu32,(0.0f<alu32));
  data0[(alu20+3)] = select(0.0f,alu33,(0.0f<alu33));
  data0[(alu20+67)] = select(0.0f,alu34,(0.0f<alu34));
  data0[(alu20+131)] = select(0.0f,alu35,(0.0f<alu35));
  data0[(alu20+195)] = select(0.0f,alu36,(0.0f<alu36));
}`;

const r_4_2_16_3_2_64_3_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@compute @workgroup_size(16,3,2) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 2 */
  var gidx1 = i32(gindex.y); /* 4 */
  var lidx0 = i32(lindex.x); /* 16 */
  var lidx1 = i32(lindex.y); /* 3 */
  var lidx2 = i32(lindex.z); /* 2 */
  var alu0 = (lidx2*3);
  var precast0 = lidx1;
  var precast1 = (bitcast<u32>(precast0)<<3u);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  for (var ridx0 = 0; ridx0 < 64; ridx0++) {
    var precast2 = ridx0;
    var precast3 = (bitcast<u32>(precast2)<<6u);
    var alu1 = (bitcast<i32>(precast3)+alu0+(gidx0*24)+bitcast<i32>(precast1));
    var val0 = data1[alu1];
    var alu2 = ((ridx0*9)+(gidx1*9216)+(lidx0*576));
    var val1 = data2[alu2];
    var val2 = data1[(alu1+1)];
    var val3 = data1[(alu1+2)];
    var val4 = data1[(alu1+3)];
    var val5 = data1[(alu1+4)];
    var val6 = data1[(alu1+8)];
    var val7 = data1[(alu1+9)];
    var val8 = data1[(alu1+10)];
    var val9 = data1[(alu1+11)];
    var val10 = data1[(alu1+12)];
    var val11 = data1[(alu1+16)];
    var val12 = data1[(alu1+17)];
    var val13 = data1[(alu1+18)];
    var val14 = data1[(alu1+19)];
    var val15 = data1[(alu1+20)];
    var val16 = data2[(alu2+1)];
    var val17 = data2[(alu2+2)];
    var val18 = data2[(alu2+3)];
    var val19 = data2[(alu2+4)];
    var val20 = data2[(alu2+5)];
    var val21 = data2[(alu2+6)];
    var val22 = data2[(alu2+7)];
    var val23 = data2[(alu2+8)];
    acc0 = (acc0+(val0*val1)+(val6*val18)+(val11*val21)+(val2*val16)+(val7*val19)+(val12*val22)+(val3*val17)+(val8*val20)+(val13*val23));
    acc1 = (acc1+(val2*val1)+(val7*val18)+(val12*val21)+(val3*val16)+(val8*val19)+(val13*val22)+(val4*val17)+(val9*val20)+(val14*val23));
    acc2 = (acc2+(val3*val1)+(val8*val18)+(val13*val21)+(val4*val16)+(val9*val19)+(val14*val22)+(val5*val17)+(val10*val20)+(val15*val23));
  }
  var precast4 = gidx1;
  var precast5 = (bitcast<u32>(precast4)<<4u);
  var val24 = data3[(lidx0+bitcast<i32>(precast5))];
  var alu7 = (alu0+(lidx1*6)+(lidx0*36)+(gidx0*18)+(gidx1*576));
  data0[alu7] = (acc0+val24);
  data0[(alu7+1)] = (acc1+val24);
  data0[(alu7+2)] = (acc2+val24);
}`;

const r_8_8_3_3_2_2 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<f32>;
@compute @workgroup_size(8,3,3) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 8 */
  var lidx0 = i32(lindex.x); /* 8 */
  var lidx1 = i32(lindex.y); /* 3 */
  var lidx2 = i32(lindex.z); /* 3 */
  var precast0 = gidx0;
  var precast1 = lidx2;
  var precast2 = (bitcast<u32>(precast0)<<3u);
  var precast3 = (bitcast<u32>(precast1)<<1u);
  var alu0 = (lidx0+bitcast<i32>(precast2));
  var val0 = data2[alu0];
  var val1 = data3[alu0];
  var val2 = data4[alu0];
  var val3 = data5[alu0];
  var alu1 = (bitcast<i32>(precast3)+(lidx1*12)+(gidx0*288)+(lidx0*36));
  var val4 = data1[alu1];
  var val5 = data1[(alu1+1)];
  var val6 = data1[(alu1+6)];
  var val7 = data1[(alu1+7)];
  var alu2 = (1/sqrt((val2+1e-05f)));
  var alu3 = (((select(0.0f,val4,(0.0f<val4))-val0)*val1*alu2)+val3);
  var alu4 = (((select(0.0f,val5,(0.0f<val5))-val0)*val1*alu2)+val3);
  var alu5 = (((select(0.0f,val6,(0.0f<val6))-val0)*val1*alu2)+val3);
  var alu6 = select(alu3,alu5,(alu3<alu5));
  var alu7 = select(alu6,alu4,(alu6<alu4));
  var alu8 = (((select(0.0f,val7,(0.0f<val7))-val0)*val1*alu2)+val3);
  data0[(lidx2+(lidx1*3)+(gidx0*72)+(lidx0*9))] = select(alu7,alu8,(alu7<alu8));
}`;

const r_10_16_36 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
var<workgroup> temp0: array<f32, 16>;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@compute @workgroup_size(16) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 10 */
  var lidx0 = i32(lindex.x); /* 16 */
  var val0 = data3[gidx0];
  var alu0 = (lidx0*36);
  var acc0 = 0.0f;
  for (var ridx0 = 0; ridx0 < 36; ridx0++) {
    var val1 = data1[(alu0+ridx0)];
    var val2 = data2[((gidx0*576)+alu0+ridx0)];
    acc0 = (acc0+(val1*val2));
  }
  temp0[lidx0] = acc0;
  workgroupBarrier();
  if (((bool(lidx0))!=true)) {
    var acc1 = 0.0f;
    for (var ridx1 = 0; ridx1 < 16; ridx1++) {
      var val3 = temp0[ridx1];
      acc1 = (acc1+val3);
    }
    data0[gidx0] = (acc1+val0);
  }
}`;

const setupNet = async (safetensor) => {
    const metadata = getTensorMetadata(safetensor);
    const infinityBuf = createInfinityUniformBuf(device);

    const layouts=[device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]})]

    const buf_0 = createEmptyBuf(device, 73728);;
    const input0 = createEmptyBuf(device, 3136);;
    const buf_1 = createWeightBuf(device, 3200, getTensorBuffer(safetensor, metadata['layers.0.weight']));
    const buf_2 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['layers.0.bias']));
    const buf_3 = createEmptyBuf(device, 51200);;
    const buf_4 = createWeightBuf(device, 102400, getTensorBuffer(safetensor, metadata['layers.2.weight']));
    const buf_5 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['layers.2.bias']));
    const buf_6 = createEmptyBuf(device, 12800);;
    const buf_7 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['layers.4.running_mean']));
    const buf_8 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['layers.4.weight']));
    const buf_9 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['layers.4.running_var']));
    const buf_10 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['layers.4.bias']));
    const buf_11 = createEmptyBuf(device, 16384);;
    const buf_12 = createWeightBuf(device, 73728, getTensorBuffer(safetensor, metadata['layers.6.weight']));
    const buf_13 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['layers.6.bias']));
    const buf_14 = createEmptyBuf(device, 9216);;
    const buf_15 = createWeightBuf(device, 147456, getTensorBuffer(safetensor, metadata['layers.8.weight']));
    const buf_16 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['layers.8.bias']));
    const buf_17 = createEmptyBuf(device, 2304);;
    const buf_18 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['layers.10.running_mean']));
    const buf_19 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['layers.10.weight']));
    const buf_20 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['layers.10.running_var']));
    const buf_21 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['layers.10.bias']));
    const output0 = createEmptyBuf(device, 40);;
    const buf_22 = createWeightBuf(device, 23040, getTensorBuffer(safetensor, metadata['layers.13.weight']));
    const buf_23 = createWeightBuf(device, 40, getTensorBuffer(safetensor, metadata['layers.13.bias']));

    const gpuWriteBuffer0 = device.createBuffer({size:input0.size, usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.MAP_WRITE });

    const gpuReadBuffer0 = device.createBuffer({size:output0.size, usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ });

    const kernels = [r_4_3_2_8_8_5_3_4_5, r_5_5_8_4_32_5_4_4_5, r_5_5_8_2_2_4_2_2, r_2_8_8_2_32_4_4_3_3, r_4_2_16_3_2_64_3_3_3, r_8_8_3_3_2_2, r_10_16_36];
    const pipelines = await Promise.all(kernels.map(async (name, i) => {
      return await device.createComputePipelineAsync({
          layout: device.createPipelineLayout({
              bindGroupLayouts: [layouts[i]],
          }),
          compute: {
              module: device.createShaderModule({
                  code: name,
              }),
              entryPoint: "main",
          },
      });
  }))

    return async (_input0) => {
        const commandEncoder = device.createCommandEncoder();
        await gpuWriteBuffer0.mapAsync(GPUMapMode.WRITE);
        new Float32Array(gpuWriteBuffer0.getMappedRange()).set(_input0);
        gpuWriteBuffer0.unmap();
        commandEncoder.copyBufferToBuffer(gpuWriteBuffer0, 0, input0, 0, gpuWriteBuffer0.size);
        addComputePass(device, commandEncoder, pipelines[0], layouts[0], infinityBuf, [buf_0, input0, buf_1, buf_2], [3, 4, 1]);
        addComputePass(device, commandEncoder, pipelines[1], layouts[1], infinityBuf, [buf_3, buf_0, buf_4, buf_5], [5, 5, 1]);
        addComputePass(device, commandEncoder, pipelines[2], layouts[2], infinityBuf, [buf_6, buf_3, buf_7, buf_8, buf_9, buf_10], [5, 5, 1]);
        addComputePass(device, commandEncoder, pipelines[3], layouts[3], infinityBuf, [buf_11, buf_6, buf_12, buf_13], [2, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[4], layouts[4], infinityBuf, [buf_14, buf_11, buf_15, buf_16], [2, 4, 1]);
        addComputePass(device, commandEncoder, pipelines[5], layouts[5], infinityBuf, [buf_17, buf_14, buf_18, buf_19, buf_20, buf_21], [8, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[6], layouts[6], infinityBuf, [output0, buf_17, buf_22, buf_23], [10, 1, 1]);
        commandEncoder.copyBufferToBuffer(output0, 0, gpuReadBuffer0, 0, output0.size);
        const gpuCommands = commandEncoder.finish();
        device.queue.submit([gpuCommands]);

        await gpuReadBuffer0.mapAsync(GPUMapMode.READ);
        const resultBuffer0 = new Float32Array(gpuReadBuffer0.size/4);
        resultBuffer0.set(new Float32Array(gpuReadBuffer0.getMappedRange()));
        gpuReadBuffer0.unmap();
        return [resultBuffer0];
    }
}
const load = async (weight_path) => { return await fetch(weight_path).then(x => x.arrayBuffer()).then(x => setupNet(new Uint8Array(x))); }
return { load, setupNet };
})();
export default model;
