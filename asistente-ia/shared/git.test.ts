import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { writeFileSync, unlinkSync } from 'fs'
import path from 'path'
import git from '@asistente/shared/git'

const { getFileContent } = git

describe('getFileContent', () => {
  const testFile = path.resolve(__dirname, 'archivo_de_prueba.txt')

  beforeAll(() => {
    writeFileSync(testFile, 'contenido de prueba', 'utf8')
  })

  afterAll(() => {
    unlinkSync(testFile)
  })

  it('devuelve el contenido correcto de un archivo existente', () => {
    const contenido = getFileContent(testFile)
    expect(contenido).toBe('contenido de prueba')
  })

  it('lanza un error si el archivo no existe', () => {
    const ruta = path.resolve(__dirname, 'no-existe.txt')
    expect(() => getFileContent(ruta)).toThrow('Archivo no encontrado')
  })
})


const { getDiff } = git

describe('getDiff', () => {
  const untrackedFile = path.resolve(__dirname, 'archivo_no_trackeado.txt')

  beforeAll(() => {
    writeFileSync(untrackedFile, 'línea nueva para git diff', 'utf8')
  })

  afterAll(() => {
    unlinkSync(untrackedFile)
  })

  it('devuelve un diff si el archivo fue modificado y está trackeado por git', () => {
    const trackedFile = path.resolve(__dirname, '../../../README.md') // asumimos que está versionado
    const diff = getDiff(trackedFile)
    expect(diff).toBeTypeOf('string')
  })

  it('devuelve una cadena vacía si el archivo no está trackeado', () => {
    const diff = getDiff(untrackedFile)
    expect(diff).toBe('')
  })
})
