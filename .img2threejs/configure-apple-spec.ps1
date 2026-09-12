param(
  [Parameter(Mandatory = $true)]
  [string]$SpecPath
)

$ErrorActionPreference = "Stop"

function Copy-JsonObject([object]$Value) {
  return $Value | ConvertTo-Json -Depth 100 | ConvertFrom-Json
}

function New-ColorRecipe(
  [string]$Dominant,
  [string]$Secondary,
  [string]$MaterialClass,
  [double]$Confidence
) {
  return [pscustomobject]@{
    dominantAlbedo = $Dominant
    secondaryAlbedo = $Secondary
    materialClass = $MaterialClass
    materialClassConfidence = $Confidence
  }
}

function New-Feature([string]$Id, [string]$Description) {
  return [pscustomobject]@{
    id = $Id
    description = $Description
    realization = "procedural-geometry-or-material-override"
  }
}

function New-Attachment(
  [string]$ParentId,
  [string]$ParentSocket,
  [double[]]$Start,
  [double[]]$End,
  [string]$ContactType = "embed"
) {
  return [pscustomobject]@{
    parentId = $ParentId
    parentSocket = $ParentSocket
    localStart = $Start
    localEnd = $End
    contactNormal = @(0.0, 1.0, 0.0)
    contactType = $ContactType
    embedDepth = 0.04
    overlap = 0.03
    gapTolerance = 0.01
    evidenceRefs = @("full-object")
  }
}

function New-AppleComponent(
  [object]$Template,
  [string]$Id,
  [string]$Name,
  [string]$Level,
  [string]$Role,
  [string]$Primitive,
  [string]$TopologyClass,
  [string]$TopologyRationale,
  [string]$Material,
  [object]$Recipe,
  [double[]]$Dimensions,
  [double[]]$Position,
  [string[]]$FeatureIds,
  [string]$Parent = "",
  [object]$Attachment = $null
) {
  $component = Copy-JsonObject $Template
  $component.id = $Id
  $component.name = $Name
  $component.level = $Level
  $component.role = $Role
  $component.importance = if ($Level -eq "micro") { 0.65 } else { 0.9 }
  $component.confidence = if ($Level -eq "micro") { 0.78 } else { 0.88 }
  $component.primitive = $Primitive
  $component.topologyClass = $TopologyClass
  $component.topologyRationale = $TopologyRationale
  $component.geometryDescriptor.topologyIntent = $TopologyRationale
  $component.geometryDescriptor.deformationStack = @(
    "five-fold azimuthal radius modulation",
    "vertical shoulder expansion",
    "top socket depression",
    "lower-third taper"
  )
  $component.parent = if ($Parent) { $Parent } else { $null }
  $component.attachment = $Attachment
  $component.dimensions.width = $Dimensions[0]
  $component.dimensions.height = $Dimensions[1]
  $component.dimensions.depth = $Dimensions[2]
  $component.dimensions.confidence = 0.82
  $component.transform.position = $Position
  $component.transform.rotation = @(0.0, 0.0, 0.0)
  $component.transform.scale = @(1.0, 1.0, 1.0)
  $component.material = $Material
  $component.materialLayers = @($Material)
  $component.localFeatures = @(
    $FeatureIds | ForEach-Object { New-Feature $_ "Observed feature mapped from the apple detail inventory." }
  )
  $component.surfaceDetail.macroRoughness = 0.12
  $component.surfaceDetail.microRoughness = 0.06
  $component.surfaceDetail.bumpAmplitude = if ($Id -eq "stem") { 0.035 } else { 0.008 }
  $component.surfaceDetail.normalPattern = if ($Id -eq "stem") { "longitudinal-fiber" } else { "low-amplitude-skin-pores" }
  $component.surfaceDetail.displacementPattern = if ($Id -eq "fruitBody") { "five-lobe-organic" } else { "none" }
  $component.surfaceDetail.occlusionPattern = "cavity-and-contact-biased"
  $component.surfaceDetail.notes = "Independent macro, meso, and micro responses; no albedo channel reuse."
  $component.actionProfile.animationRole = if ($Id -eq "fruitBody") { "root" } else { "attached detail" }
  $component.actionProfile.pivot.mode = if ($Parent) { "socket" } else { "center" }
  $component.actionProfile.pivot.localPosition = $Position
  $component.actionProfile.pivot.confidence = 0.82
  $component.actionProfile.collider.type = if ($Id -eq "fruitBody") { "ellipsoid" } else { "capsule" }
  $component.actionProfile.collider.scale = $Dimensions
  $component.actionProfile.destruction.fractureGroup = $Id
  $component.actionProfile.destruction.debrisMaterial = $Material
  $component.evidenceRefs = @("full-object")
  $component.fidelityTier = if ($Level -eq "micro") { "surface" } else { "form" }
  $component | Add-Member -MemberType NoteProperty -Name colorMaterialRecipe -Value $Recipe -Force
  return $component
}

function New-AppleMaterial(
  [object]$Template,
  [string]$Id,
  [string]$Name,
  [string]$Color,
  [double]$Roughness,
  [string]$NormalPattern,
  [double]$NormalStrength,
  [object[]]$Overrides
) {
  $material = Copy-JsonObject $Template
  $material.id = $Id
  $material.name = $Name
  $material.type = "physical"
  $material.shaderModel = "MeshPhysicalMaterial"
  $material.baseColor = $Color
  $material.color = $Color
  $material.albedo.dominant = $Color
  $material.albedo.secondary = if ($Id -eq "appleSkin") { @("#F2302A", "#AB0C0A", "#F46E65") } else { @($Color) }
  $material.albedo.samplingNotes = "Reference-derived palette, separated from direct-light highlights."
  $material.colorVariation.palette = @($material.albedo.dominant) + @($material.albedo.secondary)
  $material.colorVariation.pattern = if ($Id -eq "appleSkin") { "five-lobe cavity-biased variation" } else { "longitudinal variation" }
  $material.colorVariation.amplitude = if ($Id -eq "appleSkin") { 0.18 } else { 0.1 }
  $material.roughness.base = $Roughness
  $material.roughness.variation = 0.12
  $material.roughness.map = "independent-procedural-field"
  $material.normal.pattern = $NormalPattern
  $material.normal.strength = $NormalStrength
  $material.bump.pattern = $NormalPattern
  $material.bump.amplitude = $NormalStrength * 0.12
  $material.bump.scale = 42.0
  $material.localOverrides = $Overrides
  $material.notes = "Procedural browser material informed by the supplied reference; hidden regions remain approximate."
  if ($Id -eq "appleSkin") {
    $material | Add-Member -MemberType NoteProperty -Name clearcoat -Value 0.88 -Force
    $material | Add-Member -MemberType NoteProperty -Name clearcoatRoughness -Value 0.16 -Force
  }
  return $material
}

$resolved = Resolve-Path -LiteralPath $SpecPath
$spec = Get-Content -LiteralPath $resolved -Raw | ConvertFrom-Json
$componentTemplate = $spec.componentTree[0]
$materialTemplate = $spec.materials[0]

$spec.suitability = "pass"
$spec.scores.object_isolation = 3
$spec.scores.silhouette_readability = 3
$spec.scores.depth_inference = 2
$spec.scores.primitive_decomposition = 3
$spec.scores.material_procedurality = 3
$spec.scores.occlusion_risk = 2
$spec.scores.interaction_fit = 3
$spec.referenceCamera.fovDegrees = 32.0
$spec.referenceCamera.positionHint = @(0.0, 0.05, 4.2)
$spec.referenceCamera.note = "Near-orthographic frontal reference. Use a 32 degree perspective camera and compare at the same yaw."
$spec.assumptions = @(
  "Rear lobe depth follows the near-radial structure visible at the upper rim.",
  "The underside uses a shallow inferred depression because it is hidden in the source.",
  "Surface pixels guide color and scale, while browser materials remain procedural for rotation and relighting."
)
$spec.coordinateFrame.front = "+Z points toward the reference camera"
$spec.coordinateFrame.up = "+Y"
$spec.coordinateFrame.scaleReference = "fruit body height equals 2.0 world units; stem excluded"
$spec.silhouette.boundingShape = "continuous oblate organic volume with broad upper shoulders and a narrowed two-foot base"
$spec.silhouette.aspectRatios = @("fruit-width:fruit-height=1.02:1", "fruit-depth:fruit-width=0.82:1", "stem-height:fruit-height=0.26:1")
$spec.silhouette.symmetry = "near-radial five-lobe body with a slightly asymmetric curved stem"
$spec.silhouette.dominantCurves = @(
  "convex shoulders crest near y=0.55",
  "sidewalls narrow below y=-0.35",
  "five azimuthal lobes soften toward both poles",
  "stem follows a backward-leaning cubic curve"
)
$spec.silhouette.negativeSpaces = @("deep top socket around the stem", "shallow base notch between two frontal feet")
$spec.silhouette.landmarks = @("upper shoulder rim", "top socket floor", "widest equator", "lower taper", "stem cut tip")
$spec.viewEvidence[0].observations = @(
  "Fruit occupies 43 percent of the square frame with a fully readable silhouette.",
  "Five broad vertical lobes and the top socket are visible.",
  "The rear surface and underside are not visible and are inferred."
)
$spec.viewEvidence[0].confidence = 0.86

$appleRecipe = New-ColorRecipe "rgba(224, 16, 13, 1)" "rgba(171, 12, 10, 1)" "skin" 0.86
$darkRecipe = New-ColorRecipe "rgba(126, 8, 10, 1)" "rgba(171, 12, 10, 1)" "skin" 0.82
$stemRecipe = New-ColorRecipe "rgba(111, 62, 33, 1)" "rgba(66, 39, 24, 1)" "wood" 0.75
$spotRecipe = New-ColorRecipe "rgba(247, 213, 187, 1)" "rgba(233, 172, 144, 1)" "skin" 0.72

$fruitBody = New-AppleComponent $componentTemplate "fruitBody" "Continuous five-lobe fruit body" "macro" "fruit body" "ellipsoid" "continuous-sculpt" "The photographed silhouette is a single uninterrupted organic skin whose five broad lobes deform one volume." "appleSkin" $appleRecipe @(2.05, 2.0, 1.68) @(0.0, 0.0, 0.0) @("broadUpperShoulders", "topCavity", "lobeWave", "lobeGrooves", "taperedBase")
$fruitBody.geometryDescriptor.deformationStack = @(
  "radius *= 1 + 0.075*cos(5*azimuth + 0.32)",
  "radius *= shoulderProfile(y)",
  "y -= topSocketFalloff(radius)",
  "radius *= lowerTaper(y)"
)
$fruitBody.actionProfile.sockets = @(
  [pscustomobject]@{ id = "stemSocket"; localPosition = @(0.0, 0.72, 0.0); localRotation = @(0.0, 0.0, 0.0) }
)

$stemAttachment = New-Attachment "fruitBody" "stemSocket" @(0.0, 0.68, 0.0) @(0.14, 1.26, -0.08)
$stem = New-AppleComponent $componentTemplate "stem" "Curved embedded stem" "macro" "appendage" "curve-sweep" "fiber-strand" "The visible stem has a tapered curved centerline and a fibrous surface distinct from the fruit skin." "stemFiber" $stemRecipe @(0.16, 0.62, 0.16) @(0.0, 0.68, 0.0) @("curvedCenterline", "rootSocket") "fruitBody" $stemAttachment
$stem.geometryDescriptor.deformationStack = @("cubic curve through four control points", "radius tapers from 0.075 to 0.052", "subtle six-fold fiber modulation")

$topRim = New-AppleComponent $componentTemplate "topRim" "Upper shoulder rim" "meso" "surface guide" "torus" "surface-relief" "The top rim is a raised annular transition that frames the visible depression without becoming a detached object." "appleSkinDark" $darkRecipe @(0.72, 0.12, 0.58) @(0.0, 0.63, 0.0) @("upperRimTransition") "fruitBody"
$lowerLeft = New-AppleComponent $componentTemplate "lowerLeftLobe" "Lower left lobe guide" "meso" "form guide" "ellipsoid" "conforming-shell" "The lower frontal silhouette shows a rounded left foot blended into the continuous skin." "appleSkin" $appleRecipe @(0.68, 0.48, 0.58) @(-0.34, -0.76, 0.12) @("leftBaseFoot") "fruitBody"
$lowerRight = New-AppleComponent $componentTemplate "lowerRightLobe" "Lower right lobe guide" "meso" "form guide" "ellipsoid" "conforming-shell" "The lower frontal silhouette shows a rounded right foot blended into the continuous skin." "appleSkin" $appleRecipe @(0.68, 0.48, 0.58) @(0.34, -0.76, 0.12) @("rightBaseFoot") "fruitBody"
$lenticels = New-AppleComponent $componentTemplate "lenticelField" "Instanced pale lenticel field" "micro" "surface detail" "instanced-cluster" "surface-relief" "The reference contains hundreds of small pale marks distributed over the curved skin with deterministic irregularity." "lenticelMatte" $spotRecipe @(2.0, 1.86, 1.64) @(0.0, -0.04, 0.0) @("irregularDistribution") "fruitBody"
$stemFibers = New-AppleComponent $componentTemplate "stemFiberLines" "Stem longitudinal fiber lines" "micro" "surface detail" "tube" "fiber-strand" "Fine longitudinal relief follows the stem centerline and breaks the highlight along its length." "stemFiber" $stemRecipe @(0.17, 0.6, 0.17) @(0.0, 0.69, 0.0) @("longitudinalRidges") "stem" (New-Attachment "stem" "fiberSurface" @(0.0, 0.0, 0.0) @(0.0, 0.56, 0.0) "overlap")

$spec.componentTree = @($fruitBody, $stem, $topRim, $lowerLeft, $lowerRight, $lenticels, $stemFibers)

$appleSkin = New-AppleMaterial $materialTemplate "appleSkin" "Glossy red fruit skin" "#E0100D" 0.28 "independent low-amplitude skin pores" 0.12 @(
  [pscustomobject]@{ id = "leftGlossBand"; region = "front-left shoulder"; roughness = 0.12; clearcoat = 0.95; evidenceRefs = @("full-object") },
  [pscustomobject]@{ id = "centerGlossBand"; region = "front center-right lobe"; roughness = 0.16; clearcoat = 0.9; evidenceRefs = @("full-object") },
  [pscustomobject]@{ id = "darkGrooveVariation"; region = "five longitudinal valleys"; roughness = 0.34; baseColor = "#8E0B0C"; evidenceRefs = @("full-object") }
)
$appleSkinDark = New-AppleMaterial $materialTemplate "appleSkinDark" "Dark red socket and groove skin" "#79090B" 0.36 "cavity-soft pore field" 0.08 @()
$stemFiber = New-AppleMaterial $materialTemplate "stemFiber" "Dry fibrous stem" "#6F3E21" 0.76 "longitudinal fiber ridges" 0.35 @(
  [pscustomobject]@{ id = "longitudinalRidges"; region = "full stem"; roughness = 0.84; normalStrength = 0.38; evidenceRefs = @("full-object") }
)
$lenticelMatte = New-AppleMaterial $materialTemplate "lenticelMatte" "Pale matte lenticels" "#F7D5BB" 0.62 "none" 0.0 @()
$spec.materials = @($appleSkin, $appleSkinDark, $stemFiber, $lenticelMatte)

$spec.repetitionSystems = @(
  [pscustomobject]@{
    id = "lenticelDistribution"
    kind = "surface-poisson-array"
    count = 190
    pitch = 0.09
    axis = "surface-normal"
    target = "lenticelField"
    realization = "THREE.InstancedMesh with seeded spherical sampling, five-lobe radius projection, scale variation, and cavity exclusion."
    evidence = @("full-object")
    confidence = 0.9
    buildsGeometry = $true
    instances = 190
    geometry = [pscustomobject]@{ primitive = "ellipsoid"; radius = 0.009; depth = 0.003 }
  }
)

$spec.featureReviewTargets = @(
  [pscustomobject]@{ id = "overall-silhouette"; name = "Broad shoulders and narrowed two-foot base"; tier = "critical"; passIds = @("blockout", "form-refinement"); minimumScore = 0.8; mustPass = $true; componentRefs = @("fruitBody"); evidenceRefs = @("full-object") },
  [pscustomobject]@{ id = "five-lobe-body"; name = "Continuous five-lobe body and top socket"; tier = "critical"; passIds = @("structural-pass", "form-refinement"); minimumScore = 0.8; mustPass = $true; componentRefs = @("fruitBody", "topRim"); evidenceRefs = @("full-object") },
  [pscustomobject]@{ id = "stem-attachment"; name = "Curved stem embedded below the rim"; tier = "critical"; passIds = @("structural-pass", "form-refinement"); minimumScore = 0.8; mustPass = $true; componentRefs = @("stem"); evidenceRefs = @("full-object") },
  [pscustomobject]@{ id = "skin-clearcoat"; name = "Layered red clearcoat response"; tier = "important"; passIds = @("material-pass", "lighting-pass"); minimumScore = 0.7; mustPass = $true; componentRefs = @("fruitBody"); evidenceRefs = @("full-object") },
  [pscustomobject]@{ id = "lenticels"; name = "Irregular pale lenticel distribution"; tier = "important"; passIds = @("surface-pass"); minimumScore = 0.68; mustPass = $true; componentRefs = @("lenticelField"); evidenceRefs = @("full-object") }
)

$allComponentIds = @($spec.componentTree | ForEach-Object { $_.id })
foreach ($pass in $spec.buildPasses) {
  $pass.componentRefs = $allComponentIds
}
$spec.performanceBudget.targetTriangles = 70000
$spec.performanceBudget.maxDrawCalls = 32
$spec.performanceBudget.textureSize = 1024
$spec.performanceBudget.fpsTarget = 60
$spec.performanceBudget.optimizationPolicy = "Use one continuous body mesh, one stem mesh, and instancing for lenticels; pause rendering offscreen."
$spec.lightingFromPhoto = @(
  "Key light: large soft source from upper-front-left at neutral 5200K, intensity 3.2.",
  "Fill light: broad front-right green-tinted bounce, intensity 0.75.",
  "Rim light: narrow rear-right warm source, intensity 1.4.",
  "Exposure 1.0 with ACES filmic tone mapping.",
  "Background #101916 with a soft contact shadow under the fruit; no emissive halo."
)
$spec.proceduralStrategy = @(
  "Start from a UV sphere and rewrite vertices with vertical profile and five-fold azimuthal radius modulation.",
  "Carve the top socket and lower notch into the same continuous vertex field.",
  "Generate the stem from a Catmull-Rom curve and a tapered TubeGeometry.",
  "Place pale lenticels with a seeded surface sampler and InstancedMesh.",
  "Use MeshPhysicalMaterial clearcoat and vertex colors for lobe-value variation.",
  "Pause the render loop outside the viewport and cap device pixel ratio at 1.75."
)
$spec.animationAnchors = @(
  "fruitBody root pivot supports continuous Y rotation and bounded pointer-driven X/Y offsets",
  "stem pivot remains attached to stemSocket during all root transforms",
  "lenticelField shares the fruit root transform and never recomputes per frame"
)
$spec.risks = @(
  "One frontal image cannot verify rear lobe depth or underside shape.",
  "Too much lobe modulation will read as a pumpkin; keep amplitude below 0.09.",
  "Dense lenticels can shimmer on mobile; scale by camera distance and cap DPR.",
  "Baked highlights from the reference must not be copied into rotating albedo."
)

$spec | ConvertTo-Json -Depth 100 | Set-Content -LiteralPath $resolved -Encoding utf8
Write-Output $resolved
