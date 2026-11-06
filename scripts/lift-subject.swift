// Cuts the main subject (the house) out of a photo, keeping the input's pixel
// size, so the mobile hero can stack it above the "La Verte" title and the
// roof hides the bottom of the word. Run this again whenever the hero photo
// changes: the cut-out must line up pixel for pixel with the photo under it.
//
//   swift scripts/lift-subject.swift in.jpg out.png
//   cwebp -q 82 out.png -o public/images/mobile/aframe-house.webp
//
// macOS 14+ only (Vision foreground instance masks).
import CoreImage
import Foundation
import Vision

let args = CommandLine.arguments
guard args.count == 3 else { fatalError("usage: swift lift-subject.swift in.jpg out.png") }
let input = URL(fileURLWithPath: args[1]), output = URL(fileURLWithPath: args[2])
guard let ci = CIImage(contentsOf: input) else { fatalError("cannot read \(input.path)") }
let handler = VNImageRequestHandler(ciImage: ci)
let req = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([req])
guard let obs = req.results?.first else { fatalError("no subject found") }
let buf = try obs.generateMaskedImage(ofInstances: obs.allInstances, from: handler, croppedToInstancesExtent: false)
try CIContext().writePNGRepresentation(
  of: CIImage(cvPixelBuffer: buf), to: output, format: .RGBA8,
  colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
print("wrote", output.path)
