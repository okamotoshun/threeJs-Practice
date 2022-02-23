import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
let scene, camera, renderer, pointLight, controls;

function init() {
  // シーンを追加
  scene = new THREE.Scene();
  // カメラを追加, PerspectiveCamera(視野角, アスペクト比, 開始距離, 終了距離)
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  // カメラ位置の修正
  camera.position.set(0, 0, +500);
  // レンダラーを追加 option({alpha = 透明度})
  renderer = new THREE.WebGL1Renderer({ alpha: true });
  // サイズを画面一杯に変更
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  // DOM要素追加
  document.body.appendChild(renderer.domElement);
  //レンダリング
  renderer.render(scene, camera);

  // テクスチャーを追加
  const texture = new THREE.TextureLoader().load("./images/earth.JPG");

  // 地球を描く
  // ジオメトリーを追加(骨格)
  const ballGeometry = new THREE.SphereGeometry(100, 64, 32);
  // マテリアルを追加(色)
  const ballMaterial = new THREE.MeshPhysicalMaterial({ map: texture });
  // メッシュを追加(ジオメトリーとマテリアルを組み合わせたもの)
  const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
  // メッシュをシーンに追加
  scene.add(ballMesh);

  // 平行光源を追加
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(1, 1, 1);
  // 光源を追加
  scene.add(directionalLight);

  // ポイント光源を追加
  pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(-200, -200, -200);
  scene.add(pointLight);

  // ポイント光源を特定
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 30);
  scene.add(pointLightHelper);

  // マウスを操作する
  controls = new OrbitControls(camera, renderer.domElement);

  window.addEventListener('resize', onWindowResize);

  animate();
}

// ブラウザのリサイズに対応
function onWindowResize() {
  // レンダラーのサイズを随時更新
  renderer.setSize(window.innerWidth, window.innerHeight);

  // カメラのアスペクト比を正す
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function animate(params) {
  // ポイント光源を球の周りを徘徊させる
  pointLight.position.set(
    200 * Math.sin(Date.now() / 500),
    200 * Math.sin(Date.now() / 1000),
    200 * Math.cos(Date.now() / 500)
  );

  requestAnimationFrame(animate);
  // レンダリング
  renderer.render(scene, camera);
}

// 読み込み完了したら
window.addEventListener('load', init);
